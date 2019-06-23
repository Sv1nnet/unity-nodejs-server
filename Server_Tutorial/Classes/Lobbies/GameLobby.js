/* eslint-disable no-param-reassign */
const LobbyBase = require('./LobbyBase');
const GameLobbySettings = require('./GameLobbySettings');
const Connection = require('../Connection');
const Bullet = require('../Bullet');

module.exports = class GameLobby extends LobbyBase {
  constructor(id, settings = GameLobbySettings) {
    super(id);
    this.settings = settings;
    this.bullets = [];
  }

  onUpdate() {
    const lobby = this;

    lobby.updateBullets();
    lobby.updateDeadPlayers();
  }

  canEnterLobby(connection = Connection) {
    const lobby = this;
    const maxPlayerCount = lobby.settings.maxPlayers;
    const currentPlayerCount = lobby.connections.length;

    if (currentPlayerCount + 1 > maxPlayerCount) {
      return false;
    }

    return true;
  }

  onEnterLobby(connection) {
    const lobby = this;

    super.onEnterLobby(connection);

    lobby.addPlayer(connection);

    // Handle spawning any server spawned objects here
    // Exemple: loot, perhaps flying bullets etc
  }

  onLeaveLobby(connection = Connection) {
    const lobby = this;

    super.onLeaveLobby(connection);

    lobby.removePlayer(connection);

    // Handle spawning any server spawned objects here
    // Exemple: loot, perhaps flying bullets etc
  }

  updateBullets() {
    const lobby = this;
    const { bullets, connections } = lobby;

    bullets.forEach((bullet) => {
      const isDestroyed = bullet.onUpdate();

      if (isDestroyed) {
        lobby.despawnBullet(bullet);
      } else {
        // const returnData = {
        //   id: bullet.id,
        //   position: {
        //     x: bullet.position.x,
        //     y: bullet.position.y,
        //   },
        // };

        // connections.forEach(connection => connection.socket.emit('updatePosition', returnData));
      }
    });
  }

  onFireBullet(connection = Connection, data) {
    const lobby = this;
    const bullet = new Bullet();

    bullet.name = 'Bullet';
    bullet.activator = data.activator;
    bullet.position.x = data.position.x;
    bullet.position.y = data.position.y;
    bullet.direction.x = data.direction.x;
    bullet.direction.y = data.direction.y;

    lobby.bullets.push(bullet);

    const returnData = {
      name: bullet.name,
      id: bullet.id,
      activator: bullet.activator,
      position: {
        x: bullet.position.x,
        y: bullet.position.y,
      },
      direction: {
        x: bullet.direction.x,
        y: bullet.direction.y,
      },
      speed: bullet.speed,
    };

    connection.socket.emit('serverSpawn', returnData);
    connection.socket.broadcast.to(lobby.id).emit('serverSpawn', returnData); // Only broadcast to those in the same lobby as us
  }

  onCollisionDestroy(connection = Connection, data) {
    const lobby = this;

    const returnBullets = lobby.bullets.filter(bullet => bullet.id === data.id);

    returnBullets.forEach((bullet) => {
      const playerHit = false;

      lobby.connections.forEach((c) => {
        const { player } = c;

        if (bullet.activator != player.id) {
          const distance = bullet.position.Distance(player.position);

          if (distance < 0.65) {
            const isDead = player.dealDamage(50);
            if (isDead) {
              console.log(`Player with id: ${player.id} has died`);
              const returnData = {
                id: player.id,
              };
              c.socket.emit('playerDied', returnData);
              c.socket.broadcast.to(lobby.id).emit('playerDied', returnData);
            } else {
              console.log(`Player with id: ${player.id} has (${player.health}) health left`);
            }
            lobby.despawnBullet(bullet);
          }
        }
      });

      if (!playerHit) {
        bullet.isDestroyed = true;
      }
    });
  }

  despawnBullet(bullet = Bullet) {
    const lobby = this;
    const { bullets } = lobby;
    const { connections } = lobby;

    console.log(`Destroying bullet (${bullet.id})`);
    const index = bullets.indexOf(bullet);
    if (index > -1) {
      bullets.splice(index, 1);

      const returnData = {
        id: bullet.id,
      };

      // Send remove bullet command to players
      connections.forEach((connection) => {
        connection.socket.emit('serverUnspawn', returnData);
      });
    }
  }

  updateDeadPlayers() {
    const lobby = this;
    const { connections } = lobby;

    connections.forEach((connection) => {
      const { player } = connection;

      if (player.isDaed) {
        const isRespawn = player.respawnCounter();
        if (isRespawn) {
          const { socket } = connection;
          const returnData = {
            id: player.id,
            position: {
              x: player.position.x,
              y: player.position.y,
            },
          };

          socket.emit('playerRespawn', returnData);
          socket.broadcast.to(lobby.id).emit('playerRespawn', returnData);
        }
      }
    });
  }

  addPlayer(connection = Connection) {
    const lobby = this;
    const { connections } = lobby;
    const { socket } = connection;

    const returnData = {
      id: connection.player.id,
    };

    socket.emit('spawn', returnData); // tell myself I have spawned
    socket.broadcast.to(lobby.id).emit('spawn', returnData); // Tell others

    // Tell myself about everyone else already in the lobby
    connections.forEach((c) => {
      if (c.player.id !== connection.player.id) {
        socket.emit('spawn', {
          id: c.player.id,
        });
      }
    });
  }

  removePlayer(connection = Connection) {
    const lobby = this;

    connection.socket.broadcast.to(lobby.id).emit('disconnected', {
      id: connection.player.id,
    });
  }
};

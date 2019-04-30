/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const io = require('socket.io')(process.env.PORT || 52300);

// Custom classes
const Player = require('./Classes/Player');
const Bullet = require('./Classes/Bullet');

console.log('Server has started on port', process.env.PORT || 52300);

const players = [];
const sockets = [];
const bullets = [];

// Updates
setInterval(() => {
  bullets.forEach((bullet) => {
    const isDestroyed = bullet.onUpdate();
    // Remove
    if (isDestroyed) {
      const index = bullets.indexOf(bullet);
      if (index > -1) {
        bullets.splice(index, 1);

        const returnData = {
          id: bullet.id,
        };

        for (const playerID in players) {
          sockets[playerID].emit('sreverUnspawned', returnData);
        }
      }
    } else {
      const returnData = {
        id: bullet.id,
        position: {
          x: bullet.position.x,
          y: bullet.position.y,
        },
      };

      for (const playerID in players) {
        sockets[playerID].emit('updatePosition', returnData);
      }
    }
  });
}, 100, 0);

io.on('connection', (socket) => {
  console.log('Connection Made');

  const player = new Player();
  const thisPlayerID = player.id;

  players[thisPlayerID] = player;
  sockets[thisPlayerID] = socket;

  // Tell the client that this is out id for the server
  socket.emit('register', { id: thisPlayerID });
  socket.emit('spawn', player); // Tell myself I have spawned
  socket.broadcast.emit('spawn', player); // broadcast - tell every users who connected to io exept myself

  // Tell myself about everyone else in the game
  for (const playerID in players) {
    if (playerID !== thisPlayerID) {
      socket.emit('spawn', players[playerID]);
    }
  }

  // Positional Data from Client
  socket.on('updatePosition', (data) => {
    player.position.x = data.position.x;
    player.position.y = data.position.y;

    socket.broadcast.emit('updatePosition', player);
  });

  socket.on('updateRotation', (data) => {
    player.tankRotation = data.tankRotation;
    player.barrelRotation = data.barrelRotation;

    socket.broadcast.emit('updateRotation', player);
  });

  socket.on('fireBullet', (data) => {
    const bullet = new Bullet();
    bullet.name = 'Bullet';
    bullet.position.x = data.position.x;
    bullet.position.y = data.position.y;
    bullet.direction.x = data.direction.x;
    bullet.direction.y = data.direction.y;

    bullets.push(bullet);

    const returnData = {
      name: bullet.name,
      id: bullet.id,
      position: {
        x: bullet.position.x,
        y: bullet.position.y,
      },
      direction: {
        x: bullet.direction.x,
        y: bullet.direction.y,
      },
    };

    socket.emit('serverSpawn', returnData);
    socket.broadcast.emit('serverSpawn', returnData);
  });

  socket.on('disconnect', () => {
    console.log('A player has disconnected');
    delete players[thisPlayerID];
    delete sockets[thisPlayerID];
    socket.broadcast.emit('disconnected', player);
  });
});

function interval(func, wait, times) {
  const interv = (function interv(w, t) {
    return function intervResult() {
      if (typeof t === 'undefined' || t-- > 0) {
        setTimeout(interv, w);
        try {
          func.call(null);
        } catch (e) {
          t = 0;
          throw e.toString();
        }
      }
    };
  }(wait, times));

  setTimeout(interv, wait);
}

module.exports = class Connection {
  constructor(connectionData) {
    const {
      socket,
      player,
      server,
      lobby,
    } = connectionData;

    this.socket = socket;
    this.player = player;
    this.server = server;
    this.lobby = lobby;
  }

  // Handles all our io events and where we should route them too to be handled
  createEvents() {
    const connection = this;
    const { socket } = connection;
    const { server } = connection;
    const { player } = connection;

    socket.on('disconnect', () => {
      server.onDisconnected(connection);
    });
    socket.on('joinGame', () => {
      server.onAttepmtToJoinGame(connection);
    });
    socket.on('fireBullet', (data) => {
      connection.lobby.onFireBullet(connection, data);
    });
    socket.on('collisionDestroy', (data) => {
      connection.lobby.onCollisionDestroy(connection, data);
    });
    socket.on('updatePosition', (data) => {
      player.position.x = data.position.x;
      player.position.y = data.position.y;

      socket.broadcast.to(connection.lobby.id).emit('updatePosition', player);
    });
    socket.on('updateRotation', (data) => {
      player.tankRotation = data.tankRotation;
      player.barrelRotation = data.barrelRotation;

      socket.broadcast.to(connection.lobby.id).emit('updateRotation', player);
    });
  }
}
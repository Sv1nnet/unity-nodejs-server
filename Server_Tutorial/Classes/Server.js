/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const Connection = require('./Connection');
const Player = require('./Player');
const GameLobby = require('./Lobbies/GameLobby');
const LobbyBase = require('./Lobbies/LobbyBase');
const GameLobbySettings = require('./Lobbies/GameLobbySettings');

module.exports = class Sever {
  constructor() {
    this.connections = [];
    this.lobbies = [];

    this.lobbies[0] = new LobbyBase(0);
  }

  // Interval updates every 100 ms
  onUpdate() {
    const server = this;

    for (const id in server.lobbies) {
      server.lobbies[id].onUpdate();
    }
  }

  // Handle a new connection to the server
  onConnected(socket) {
    const player = new Player();
    const server = this;
    const { lobbies } = server;

    socket.join(player.lobby);

    const connection = new Connection({
      socket,
      player,
      server,
      lobby: lobbies[player.lobby],
    });

    console.log(`Added a new player to the lobby (${player.id})`);
    server.connections[player.id] = connection;
    connection.lobby.onEnterLobby(connection);

    return connection;
  }

  onDisconnected(connection = Connection) {
    const server = this;
    const { id } = connection.player;

    delete server.connections[id];
    console.log('Player', connection.player.displayPlayerInformation, 'has disconnected');

    // Tell other players currently in the lobby that we have disconnected from the server
    connection.socket.broadcast.to(connection.player.lobby).emit('disconnected', {
      id,
    });

    // Perform lobby clean up
    server.lobbies[connection.player.lobby].onLeaveLobby(connection);
  }

  onAttepmtToJoinGame(connection = Connection) {
    // Look through lobbies for a gamelobby
    const server = this;
    let lobbyFound = false;

    const gameLobbies = server.lobbies.filter(item => item instanceof GameLobby);
    console.log('Found (', gameLobbies.length, ') lobbies on the server');

    gameLobbies.forEach((lobby) => {
      if (!lobbyFound) {
        let canJoin = lobby.canEnterLobby(connection);

        if (canJoin) {
          lobbyFound = true;
          server.onSwitchLobby(connection, lobby.id);
        }
      }
    });

    // All game lobbies are full or we have never created one
    if (!lobbyFound) {
      console.log('Making a new lobby');
      const gamelobby = new GameLobby(gameLobbies.length + 1, new GameLobbySettings('FFA', 2));
      server.lobbies.push(gamelobby);
      server.onSwitchLobby(connection, gamelobby.id);
    }
  }

  onSwitchLobby(connection = Connection, lobbyID) {
    const server = this;
    const { lobbies } = server;

    connection.socket.join(lobbyID); // Join the new lobby's socket channel
    connection.lobby = lobbies[lobbyID]; // Assign reference to the new lobby

    lobbies[connection.player.lobby].onLeaveLobby(connection);
    lobbies[lobbyID].onEnterLobby(connection);
  }
};

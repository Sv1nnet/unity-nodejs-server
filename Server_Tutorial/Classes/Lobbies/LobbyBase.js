/* eslint-disable no-param-reassign */
const Connection = require('../Connection');

module.exports = class LobbyBase {
  constructor(id) {
    this.id = id;
    this.connections = [];
  }

  onUpdate() {

  }

  onEnterLobby(connection = Connection) {
    const lobby = this;
    const { player } = connection;

    console.log(`Player ${player.displayPlayerInformation()} has entered the lobby (${lobby.id})`);

    lobby.connections.push(connection);

    player.lobby = lobby.id;
    connection.lobby = lobby;
  }

  onLeaveLobby(connection = Connection) {
    const lobby = this;
    const { player } = connection;

    console.log(`Player ${player.displayPlayerInformation()} has left the lobby (${lobby.id})`);

    connection.lobby = undefined;

    const index = lobby.connections.indexOf(connection);

    if (index > -1) {
      lobby.connections.splice(index, 1);
    }
  }
}
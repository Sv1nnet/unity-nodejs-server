module.exports = class GameLobbySettings {
  constructor(gameMode = 'No gameMode defined!', maxPlayers) {
    this.gameMode = gameMode;
    this.maxPlayers = maxPlayers;
  }
};

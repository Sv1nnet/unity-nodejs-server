const shortID = require('shortid');
const Vector2 = require('./Vector2');

module.exports = class Player {
  constructor() {
    this.username = '';
    this.id = shortID.generate();
    this.position = new Vector2();
    this.position.x = 0;
    this.position.y = 0;
  }
};

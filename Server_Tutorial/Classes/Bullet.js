const ServerObject = require('./ServerObject');
const Vector2 = require('./Vector2');

module.exports = class Bullet extends ServerObject {
  constructor() {
    super();
    this.direction = new Vector2();
    this.speed = 0.5;
  }

  onUpdate() {
    let posX = parseFloat(this.position.x.replace(',', '.'));
    let posY = parseFloat(this.position.y.replace(',', '.'));
    let dirX = parseFloat(this.direction.x.replace(',', '.'));
    let dirY = parseFloat(this.direction.y.replace(',', '.'));

    this.position.x = (posX + (dirX * this.speed)).toString().replace('.', ',');
    this.position.y = (posY + (dirY * this.speed)).toString().replace('.', ',');

    return false;
  }
};

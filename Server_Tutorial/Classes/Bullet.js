const ServerObject = require('./ServerObject');
const Vector2 = require('./Vector2');

module.exports = class Bullet extends ServerObject {
  constructor() {
    super();
    this.direction = new Vector2();
    this.speed = '0,5';
    this.isDestroyed = false;
    this.activator = '';
  }

  onUpdate() {
    const posX = parseFloat(this.position.x.replace(',', '.'));
    const posY = parseFloat(this.position.y.replace(',', '.'));
    const dirX = parseFloat(this.direction.x.replace(',', '.'));
    const dirY = parseFloat(this.direction.y.replace(',', '.'));

    this.position.x = (posX + (dirX * this.speed)).toString().replace('.', ',');
    this.position.y = (posY + (dirY * this.speed)).toString().replace('.', ',');

    return this.isDestroyed;
  }
};

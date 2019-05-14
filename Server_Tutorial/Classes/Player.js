const shortID = require('shortid');
const Vector2 = require('./Vector2');

module.exports = class Player {
  constructor() {
    this.username = '';
    this.id = shortID.generate();
    this.position = new Vector2();
    this.tankRotation = 0;
    this.barrelRotation = 0;
    this.health = 100;
    this.isDead = false;
    this.respawnTicker = 0;
    this.respawnTime = 0;
  }

  respawnCounter() {
    this.respawnTicker += 1;

    if (this.respawnTicker >= 10) {
      this.respawnTicker = 0;
      this.respawnTime += 1;

      // Three second respond time
      if (this.respawnTime >= 1) {
        console.log('Respawning player id:', this.id);
        this.idDead = false;
        this.respawnTicker = 0;
        this.respawnTime = 0;
        this.health = 100;
        this.position = new Vector2();

        return true;
      }
    }

    return false;
  }

  dealDamage(amount = Number) {
    // Adjust Health on getting hit
    this.health -= amount;

    // Check if we are dead
    if (this.health <= 0) {
      this.isDead = true;
      this.respawnTicker = 0;
      this.respawnTime = 0;
    }

    return this.isDead;
  }
};

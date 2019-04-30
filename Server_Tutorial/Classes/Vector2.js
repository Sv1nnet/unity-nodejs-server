module.exports = class Vector2 {
  constructor(X = '0', Y = '0') {
    this.x = X;
    this.y = Y;
  }

  Magnitude() {
    const x = parseFloat(this.x);
    const y = parseFloat(this.y);
    return Math.sqrt((x * x) + (y * y)).toString();
  }

  Normalized() {
    const mag = parseFloat(this.Magnitude());
    const x = parseFloat(this.x);
    const y = parseFloat(this.y);
    return new Vector2(x / mag, y / mag);
  }

  Distance(OtherVect = Vector2) {
    const direction = new Vector2();
    const x = parseFloat(this.x);
    const y = parseFloat(this.y);
    direction.x = (parseFloat(OtherVect.x) - x).toString();
    direction.y = (parseFloat(OtherVect.y) - y).toString();

    return direction.Magnitude();
  }

  ConsoleOutput() {
    return `(${this.x},${this.y})`;
  }
};

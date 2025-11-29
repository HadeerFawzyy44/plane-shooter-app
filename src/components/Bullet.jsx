export default class Bullet {
  constructor(x, y, width = 15, height = 30) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    this.y -= 10;
  }
}

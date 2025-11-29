/**
 * Enemy class - Fixed to handle image loading properly
 */
class Enemy {
  constructor(image, x, y, vx, vy) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.vx = vx || 0;
    this.vy = vy || 2;
    this.width = 50;
    this.height = 50;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    // ⚡ Check if image is loaded before drawing
    // if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
    if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Fallback: draw a colored rectangle if image not ready
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

export default Enemy;

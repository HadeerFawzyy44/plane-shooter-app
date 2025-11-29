export default class Player {
  constructor(x, y, width = 100, height = 100) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cooldown = 0;
  }

  move(keys, speed, canvasWidth, canvasHeight) {
    if (keys.has("ArrowLeft") || keys.has("KeyA")) this.x -= speed;
    if (keys.has("ArrowRight") || keys.has("KeyD")) this.x += speed;
    if (keys.has("ArrowUp") || keys.has("KeyW")) this.y -= speed;
    if (keys.has("ArrowDown") || keys.has("KeyS")) this.y += speed;

    this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
    this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
  }

  reduceCooldown() {
    if (this.cooldown > 0) this.cooldown--;
  }
}

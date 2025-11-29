export default function HUD(ctx, score, gameOver, canvasWidth, canvasHeight) {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvasWidth / 2 - 90, canvasHeight / 2 + 50);
  }
}

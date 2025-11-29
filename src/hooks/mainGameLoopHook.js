import { useEffect, useRef, useState, useCallback } from "react";
import Player from "../components/Player";
import Bullet from "../components/Bullet";
import Enemy from "../components/Enemy";
import { collides } from "../utils/collision";
import { GAME_CONFIG, ASSETS } from "../constants/gameConfig";

/**
 * Super optimized game loop - ZERO LAG version
 */
export function mainGameLoopHook(canvasRef, keysRef) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0); // Keep ref for immediate updates

  const canvasSize = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const player = useRef(
    new Player(canvasSize.current.width / 2, canvasSize.current.height - 100)
  );
  const bullets = useRef([]);
  const enemies = useRef([]);

  // ⚡ Create images directly (no preloading delay)
  const images = useRef({
    player: new Image(),
    bullet: new Image(),
    background: new Image(),
    gameover: new Image(),
    enemies: ASSETS.IMAGES.ENEMIES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    }),
  });

  useEffect(() => {
    images.current.player.src = ASSETS.IMAGES.PLAYER;
    images.current.bullet.src = ASSETS.IMAGES.BULLET;
    images.current.background.src = ASSETS.IMAGES.BACKGROUND;
    images.current.gameover.src = ASSETS.IMAGES.GAMEOVER;
  }, []);

  // ⚡ Audio pool for zero-lag sound effects
  const audioPool = useRef({
    shoot: [],
    explosion: [],
    shootIndex: 0,
    explosionIndex: 0,
  });

  const bgAudio = useRef(null);

  useEffect(() => {
    // Create audio pool (5 instances each)
    for (let i = 0; i < 5; i++) {
      audioPool.current.shoot.push(new Audio(ASSETS.SOUNDS.SHOOT));
      audioPool.current.explosion.push(new Audio(ASSETS.SOUNDS.EXPLOSION));
    }

    bgAudio.current = new Audio(ASSETS.SOUNDS.BACKGROUND);
    bgAudio.current.loop = true;
    bgAudio.current.volume = GAME_CONFIG.AUDIO.BG_VOLUME;
    bgAudio.current.play().catch(() => {});

    return () => {
      bgAudio.current?.pause();
    };
  }, []);

  // ⚡ Play sound from pool (instant, no lag)
  const playSound = useCallback((type) => {
    const pool = audioPool.current[type];
    const index = audioPool.current[`${type}Index`];

    const audio = pool[index];
    audio.currentTime = 0;
    audio.play().catch(() => {});

    audioPool.current[`${type}Index`] = (index + 1) % pool.length;
  }, []);

  // Background scroll
  const bgY1 = useRef(0);
  const bgY2 = useRef(-window.innerHeight);

  // Enemy spawner
  useEffect(() => {
    let spawnInterval = GAME_CONFIG.ENEMY.BASE_SPAWN_INTERVAL;
    let timeoutId;

    const spawnEnemy = () => {
      if (gameOver) return;

      const x = Math.random() * (canvasSize.current.width - 50);
      const y = -50;
      const vx = (Math.random() - 0.5) * 2;
      const vy = 2 + Math.random() * 2;

      const randomIndex = Math.floor(
        Math.random() * images.current.enemies.length
      );
      const enemyImg = images.current.enemies[randomIndex];

      enemies.current.push(new Enemy(enemyImg, x, y, vx, vy));

      spawnInterval = Math.max(
        GAME_CONFIG.ENEMY.MIN_SPAWN_INTERVAL,
        GAME_CONFIG.ENEMY.BASE_SPAWN_INTERVAL -
          (scoreRef.current * GAME_CONFIG.ENEMY.SPAWN_ACCELERATION) / 10
      );

      timeoutId = setTimeout(spawnEnemy, spawnInterval);
    };

    timeoutId = setTimeout(spawnEnemy, spawnInterval);
    return () => clearTimeout(timeoutId);
  }, [gameOver]);

  // Restart
  const restartGame = useCallback(() => {
    bullets.current = [];
    enemies.current = [];
    player.current = new Player(
      canvasSize.current.width / 2,
      canvasSize.current.height - 100
    );
    bgY1.current = 0;
    bgY2.current = -canvasSize.current.height;
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    bgAudio.current?.play().catch(() => {});
  }, []);

  // ⚡ MAIN GAME LOOP - ULTRA OPTIMIZED
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let animationFrameId;

    const gameLoop = () => {
      const { width, height } = canvasSize.current;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Scrolling background
      if (!gameOver) {
        bgY1.current += GAME_CONFIG.BACKGROUND.SCROLL_SPEED;
        bgY2.current += GAME_CONFIG.BACKGROUND.SCROLL_SPEED;

        if (bgY1.current >= height) bgY1.current = -height;
        if (bgY2.current >= height) bgY2.current = -height;
      }

      ctx.drawImage(images.current.background, 0, bgY1.current, width, height);
      ctx.drawImage(images.current.background, 0, bgY2.current, width, height);

      // Player
      player.current.move(
        keysRef.current,
        GAME_CONFIG.PLAYER.SPEED,
        width,
        height
      );
      player.current.reduceCooldown();
      ctx.drawImage(
        images.current.player,
        player.current.x,
        player.current.y,
        player.current.width,
        player.current.height
      );

      // Shooting
      if (
        (keysRef.current.has(" ") || keysRef.current.has("Space")) &&
        player.current.cooldown <= 0
      ) {
        bullets.current.push(
          new Bullet(player.current.x + 40, player.current.y)
        );
        player.current.cooldown = GAME_CONFIG.PLAYER.COOLDOWN;
        playSound("shoot"); // ⚡ Instant sound from pool
      }

      // Bullets - optimized loop
      for (let i = bullets.current.length - 1; i >= 0; i--) {
        const b = bullets.current[i];
        b.update();
        ctx.drawImage(images.current.bullet, b.x, b.y, b.width, b.height);
        if (b.y < -20) bullets.current.splice(i, 1);
      }

      // Enemies - optimized collision detection
      for (let i = enemies.current.length - 1; i >= 0; i--) {
        const e = enemies.current[i];
        e.update();
        e.draw(ctx);

        // Bullet collision
        let enemyHit = false;
        for (let j = bullets.current.length - 1; j >= 0; j--) {
          if (collides(bullets.current[j], e)) {
            bullets.current.splice(j, 1);
            enemies.current.splice(i, 1);
            playSound("explosion"); // ⚡ Instant sound from pool
            scoreRef.current += GAME_CONFIG.SCORE.PER_ENEMY;
            setScore(scoreRef.current);
            enemyHit = true;
            break;
          }
        }

        if (enemyHit) continue;

        // Player collision
        if (collides(player.current, e)) {
          setGameOver(true);
          bgAudio.current?.pause();
          playSound("explosion");
        }

        // Remove off-screen
        if (e.y > height) enemies.current.splice(i, 1);
      }

      // Score
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);

      // Game over
      if (gameOver) {
        // background.draw(ctx, images.current.gameover, width, height);
        // ctx.drawImage(images.current.gameover, 0, bgY2.current, width, height);
        ctx.drawImage(images.current.gameover, 0, 0, width, height);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        // ctx.fillText("GAME OVER", width / 2, height / 2 - 50);
        ctx.font = "30px Arial";
        ctx.fillText(`Final Score: ${scoreRef.current}`, width / 2, height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press R to Restart", width / 2, height / 2 + 50);
        ctx.textAlign = "left";

        if (keysRef.current.has("r") || keysRef.current.has("R")) {
          restartGame();
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, playSound, restartGame]);

  return { score, gameOver, loading: false };
}

export default mainGameLoopHook;

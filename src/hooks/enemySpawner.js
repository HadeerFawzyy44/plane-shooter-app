import { useEffect, useRef, useCallback } from "react";
import Enemy from "../components/Enemy";

// Import configuration
import { GAME_CONFIG, ASSETS } from "../constants/gameConfig";
// ============================================
// 5. ENEMY SPAWNER HOOK
// ============================================
export function useEnemySpawner(enemies, enemyImages, score, gameOver) {
  useEffect(() => {
    if (gameOver) return;

    let spawnInterval = GAME_CONFIG.ENEMY.BASE_SPAWN_INTERVAL;
    let timeoutId;

    const spawnEnemy = () => {
      if (gameOver) return;

      const x = Math.random() * (window.innerWidth - 50);
      const y = -50;
      const vx = (Math.random() - 0.5) * 2;
      const vy = 2 + Math.random() * 2;

      const randomIndex = Math.floor(Math.random() * enemyImages.length);
      const enemyImg = enemyImages[randomIndex];

      enemies.current.push(new Enemy(enemyImg, x, y, vx, vy));

      // Progressive difficulty
      spawnInterval = Math.max(
        GAME_CONFIG.ENEMY.MIN_SPAWN_INTERVAL,
        GAME_CONFIG.ENEMY.BASE_SPAWN_INTERVAL -
          score * GAME_CONFIG.ENEMY.SPAWN_ACCELERATION
      );

      timeoutId = setTimeout(spawnEnemy, spawnInterval);
    };

    timeoutId = setTimeout(spawnEnemy, spawnInterval);
    return () => clearTimeout(timeoutId);
  }, [enemies, enemyImages, score, gameOver]);
}

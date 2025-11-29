// // ============================================
// // 1. CONSTANTS - Centralized configuration
// // ============================================
/**
 * Centralized game configuration
 * Modify these values to adjust game difficulty and behavior
 */
export const GAME_CONFIG = {
  PLAYER: {
    SPEED: 5,
    COOLDOWN: 15,
    WIDTH: 50,
    HEIGHT: 50,
  },
  ENEMY: {
    BASE_SPAWN_INTERVAL: 1000, // milliseconds
    MIN_SPAWN_INTERVAL: 200, // fastest spawn rate
    SPAWN_ACCELERATION: 2, // how much faster per score point
  },
  BACKGROUND: {
    SCROLL_SPEED: 2, // pixels per frame
  },
  AUDIO: {
    BG_VOLUME: 0.3,
  },
  SCORE: {
    PER_ENEMY: 10,
  },
};

/**
 * Asset paths configuration
 */
export const ASSETS = {
  IMAGES: {
    PLAYER: "/assets/sprites/player.png",
    BULLET: "/assets/sprites/bullet.png",
    BACKGROUND: "/assets/sprites/background.png",
    GAMEOVER: "/assets/sprites/gameover.png",
    ENEMIES: [
      "/assets/sprites/enemy.webp",
      "/assets/sprites/enemyHardLevelmm.png",
    ],
  },
  SOUNDS: {
    SHOOT: "/assets/sounds/shoot.mp3",
    EXPLOSION: "/assets/sounds/explosion.mp3",
    BACKGROUND: "/assets/sounds/background.mp3",
  },
};

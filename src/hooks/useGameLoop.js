// import { useEffect, useRef, useState } from "react";
// import Player from "../components/Player";
// import Bullet from "../components/Bullet";
// import Enemy from "../components/Enemy";
// import { collides } from "../utils/collision";

// const PLAYER_IMG = "/assets/sprites/player.png";
// const BULLET_IMG = "/assets/sprites/bullet.png";
// const BG_IMG = "/assets/sprites/background.png";
// const SHOOT_SOUND = "/assets/sounds/shoot.mp3";
// const EXPLOSION_SOUND = "/assets/sounds/explosion.mp3";
// const BG_MUSIC = "/assets/sounds/background.mp3";
// const GO_IMG = "/assets/sprites/gameover.png";

// const ENEMY_IMG = "/assets/sprites/enemy.webp";
// const ENEMY_HARD_IMG = "/assets/sprites/enemyHardLevelmm.png";

// export function useGameLoopXXXXX(canvasRef, keysRef) {
//   const [gameStarted, setGameStarted] = useState(false);

//   const requestRef = useRef(null);
//   const [score, setScore] = useState(0);
//   const scoreRef = useRef(0); // live score ref
//   const [gameOver, setGameOver] = useState(false);

//   const canvasSize = useRef({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });
//   const player = useRef(
//     new Player(canvasSize.current.width / 2, canvasSize.current.height - 100)
//   );
//   const bullets = useRef([]);
//   const enemies = useRef([]);
//   const shootAudio = useRef(null);
//   const explosionAudio = useRef(null);
//   const bgAudio = useRef(null);

//   const ENEMY_IMAGES = [ENEMY_IMG, ENEMY_HARD_IMG];

//   const images = useRef({
//     player: new Image(),
//     bullet: new Image(),
//     background: new Image(),
//     gameover: new Image(),
//     // enemy: new Image(),
//     // enemyHard: new Image(),
//     enemies: ENEMY_IMAGES.map((src) => {
//       const img = new Image();
//       img.src = src;
//       return img;
//     }),
//   });

//   // Background scroll positions
//   const bgY1 = useRef(0);
//   const bgY2 = useRef(-window.innerHeight);
//   const bgSpeed = 2; // adjust for faster/slower scroll

//   // Preload images
//   useEffect(() => {
//     images.current.player.src = PLAYER_IMG;
//     images.current.bullet.src = BULLET_IMG;
//     // images.current.enemy.src = ENEMY_IMG;
//     // images.current.enemyHard.src = ENEMY_HARD_IMG;
//     images.current.background.src = BG_IMG;
//     images.current.gameover.src = GO_IMG;
//   }, []);

//   // Preload audio
//   useEffect(() => {
//     shootAudio.current = new Audio(SHOOT_SOUND);
//     explosionAudio.current = new Audio(EXPLOSION_SOUND);
//     bgAudio.current = new Audio(BG_MUSIC);
//     bgAudio.current.loop = true;
//     bgAudio.current.volume = 0.3;
//     bgAudio.current.play();
//   }, []);

//   // Resize canvas
//   useEffect(() => {
//     const handleResize = () => {
//       canvasSize.current = {
//         width: window.innerWidth,
//         height: window.innerHeight,
//       };
//       player.current.x = window.innerWidth / 2;
//       player.current.y = window.innerHeight - 100;
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Spawn enemies
//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     if (!gameOver) {
//   //       const x = Math.random() * (canvasSize.current.width - 50);
//   //       const y = -50;
//   //       const vx = (Math.random() - 0.5) * 2;
//   //       const vy = 2 + Math.random() * 2;
//   //       enemies.current.push(new Enemy(x, y, vx, vy));
//   //       enemies.current.push(new Enemy(x, y, vx, vy));
//   //     }
//   //   }, 1000);
//   //   return () => clearInterval(interval);
//   // }, [gameOver]);

//   useEffect(() => {
//     let spawnInterval = 1000; // initial spawn every 1 second
//     let spawnTimer;

//     const spawnEnemy = () => {
//       if (!gameOver) {
//         const x = Math.random() * (canvasSize.current.width - 50);
//         const y = -50;
//         const vx = (Math.random() - 0.5) * 2;
//         const vy = 2 + Math.random() * 2;
//         // enemies.current.push(new Enemy(x, y, vx, vy));
//         ////////////////////////////////

//         // images.current.enemy.src = ENEMY_HARD_IMG;
//         const randomIndex = Math.floor(
//           Math.random() * images.current.enemies.length
//         );
//         const enemyImg = images.current.enemies[randomIndex];
//         enemies.current.push(new Enemy(enemyImg, x, y, vx, vy));
//       }

//       // Make spawn faster based on score instead of time
//       spawnInterval = Math.max(200, 1000 - scoreRef.current * 2);
//       spawnTimer = setTimeout(spawnEnemy, spawnInterval);
//     };
//     spawnTimer = setTimeout(spawnEnemy, spawnInterval);
//     return () => clearTimeout(spawnTimer);
//   }, [gameOver]);

//   // Restart function
//   const restartGame = () => {
//     bullets.current = [];
//     enemies.current = [];
//     player.current = new Player(
//       canvasSize.current.width / 2,
//       canvasSize.current.height - 100
//     );
//     scoreRef.current = 0;
//     setScore(0);
//     // ✅ Reset scrolling background here
//     bgY1.current = 0;
//     bgY2.current = -canvasSize.current.height;
//     setGameOver(false);
//     if (setGameStarted) setGameStarted(true);
//     if (bgAudio.current) {
//       bgAudio.current.currentTime = 0;
//       bgAudio.current.play().catch(() => {});
//     }
//     images.current.background.src = BG_IMG;
//     // setGameStarted(true);
//   };

//   const gameLoop = () => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, canvasSize.current.width, canvasSize.current.height);

//     // Draw background
//     // ctx.drawImage(images.current.background, 0, 0, canvasSize.current.width, canvasSize.current.height);
//     // === MOVING BACKGROUND ===
//     bgY1.current += bgSpeed;
//     bgY2.current += bgSpeed;

//     // Reset when off screen
//     if (bgY1.current >= canvasSize.current.height) {
//       bgY1.current = -canvasSize.current.height;
//     }
//     if (bgY2.current >= canvasSize.current.height) {
//       bgY2.current = -canvasSize.current.height;
//     }

//     // Draw two backgrounds
//     ctx.drawImage(
//       images.current.background,
//       0,
//       bgY1.current,
//       canvasSize.current.width,
//       canvasSize.current.height
//     );

//     ctx.drawImage(
//       images.current.background,
//       0,
//       bgY2.current,
//       canvasSize.current.width,
//       canvasSize.current.height
//     );

//     // Player movement
//     player.current.move(
//       keysRef.current,
//       5,
//       canvasSize.current.width,
//       canvasSize.current.height
//     );
//     player.current.reduceCooldown();
//     ctx.drawImage(
//       images.current.player,
//       player.current.x,
//       player.current.y,
//       player.current.width,
//       player.current.height
//     );

//     // Shooting bullets
//     if (
//       (keysRef.current.has(" ") || keysRef.current.has("Space")) &&
//       player.current.cooldown <= 0
//     ) {
//       bullets.current.push(new Bullet(player.current.x + 20, player.current.y));
//       player.current.cooldown = 15;
//       shootAudio.current.currentTime = 0;
//       shootAudio.current.play();
//     }

//     // Update bullets
//     for (let i = bullets.current.length - 1; i >= 0; i--) {
//       const b = bullets.current[i];
//       b.update();
//       ctx.drawImage(images.current.bullet, b.x, b.y, b.width, b.height);
//       if (b.y < -20) bullets.current.splice(i, 1);
//     }

//     // Update enemies
//     for (let i = enemies.current.length - 1; i >= 0; i--) {
//       const e = enemies.current[i];
//       e.update();
//       e.draw(ctx);
//       // ctx.drawImage(images.current.enemy, e.x, e.y, e.width, e.height);
//       // ctx.drawImage(images.current.enemyHard, e.x, e.y, e.width, e.height);

//       // Bullet collision
//       for (let j = bullets.current.length - 1; j >= 0; j--) {
//         const b = bullets.current[j];
//         if (collides(b, e)) {
//           bullets.current.splice(j, 1);
//           enemies.current.splice(i, 1);
//           explosionAudio.current.currentTime = 0;
//           explosionAudio.current.play();
//           setScore((s) => s + 10);
//           scoreRef.current += 10;
//           break;
//         }
//       }

//       // Player collision
//       if (collides(player.current, e)) {
//         setGameOver(true);
//         bgAudio.current.pause();
//         explosionAudio.current.play();
//       }

//       if (e.y > canvasSize.current.height) enemies.current.splice(i, 1);
//     }

//     // Update React state with live score
//     setScore(scoreRef.current);

//     // Draw score
//     ctx.fillStyle = "white";
//     ctx.font = "20px Arial";
//     ctx.fillText("Score: " + scoreRef.current, 10, 30);

//     // Game over
//     if (gameOver) {
//       images.current.background.src = GO_IMG;
//       bgY1.current = 0;
//       bgY2.current = 0;

//       ctx.fillStyle = "white";
//       ctx.font = "50px Arial";
//       // ctx.fillText(
//       //   "GAME OVER",
//       //   canvasSize.current.width / 2 - 150,
//       //   canvasSize.current.height / 2
//       // );
//       ctx.font = "20px Arial";
//       ctx.fillText(
//         "Press R to Restart",
//         canvasSize.current.width / 2 - 90,
//         canvasSize.current.height / 2 + 50
//       );
//       // Restart key
//       if (keysRef.current.has("r") || keysRef.current.has("R")) {
//         restartGame();
//       }
//     }

//     requestRef.current = requestAnimationFrame(gameLoop);
//   };

//   useEffect(() => {
//     requestRef.current = requestAnimationFrame(gameLoop);
//     return () => cancelAnimationFrame(requestRef.current);
//   }, [gameOver]);

//   return { score, gameOver };
// }

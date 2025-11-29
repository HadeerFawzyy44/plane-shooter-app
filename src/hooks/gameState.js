import { useState, useCallback } from "react";

/**
 * Hook for managing game state
 * @returns {Object} - Game state and controls
 */
export function useGameState() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const incrementScore = useCallback((points) => {
    setScore((prev) => prev + points);
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  return {
    score,
    gameOver,
    gameStarted,
    incrementScore,
    setGameOver,
    setGameStarted,
    reset,
  };
}

export default useGameState;

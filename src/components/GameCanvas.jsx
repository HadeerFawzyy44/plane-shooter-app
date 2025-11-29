import { useRef, useEffect } from "react";
import { mainGameLoopHook } from "../hooks/mainGameLoopHook";

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const keysRef = useRef(new Set());

  // const { score, gameOver, loading } = mainGameLoopHook(canvasRef, keysRef);
  const { score, gameOver } = mainGameLoopHook(canvasRef, keysRef);

  useEffect(() => {
    const handleKeyDown = (e) => keysRef.current.add(e.key);
    const handleKeyUp = (e) => keysRef.current.delete(e.key);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ display: "block" }}
    />
  );
}

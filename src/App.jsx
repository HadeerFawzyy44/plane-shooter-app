import { useState } from "react";
import GameCanvas from "./components/GameCanvas";

const HOME_IMG = "/assets/sprites/entering.png";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    console.log("🎮 Starting game...");
    setGameStarted(true);
  };

  return (
    <>
      {!gameStarted ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${HOME_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          //{" "}
          <button
            onClick={handleStartGame}
            style={{
              position: "absolute",
              left: "50%",
              top: "38%",
              transform: "translate(-50%, -50%)",
              padding: "15px 40px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#fff",
              background: "linear-gradient(45deg, #ff005c, #ff8a00)", // gradient button
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translate(-50%, -50%) scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = "translate(-50%, -50%) scale(1)")
            }
          >
            Start Game
          </button>
        </div>
      ) : (
        <GameCanvas />
      )}
    </>
  );
}

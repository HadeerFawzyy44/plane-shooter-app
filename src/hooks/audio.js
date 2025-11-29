import { useEffect, useRef, useCallback } from "react";

/**
 * Optimized hook for managing audio with pooling to prevent lag
 * @param {string} src - Audio file path
 * @param {Object} options - Configuration options
 * @param {number} options.volume - Volume level (0-1)
 * @param {boolean} options.loop - Whether to loop the audio
 * @param {number} options.poolSize - Number of audio instances to create (default: 5 for sound effects, 1 for music)
 * @returns {Object} - Audio controls { play, pause, audio }
 */
export function useAudio(src, options = {}) {
  const { volume = 1, loop = false, poolSize = loop ? 1 : 5 } = options;

  const audioPoolRef = useRef([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Create audio pool
    audioPoolRef.current = Array.from({ length: poolSize }, () => {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.loop = loop;
      audio.preload = "auto";
      return audio;
    });

    return () => {
      // Cleanup all audio instances
      audioPoolRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioPoolRef.current = [];
    };
  }, [src, volume, loop, poolSize]);

  const play = useCallback(() => {
    if (audioPoolRef.current.length === 0) return;

    if (poolSize === 1) {
      // Single instance (for background music)
      const audio = audioPoolRef.current[0];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      // Pool of instances (for sound effects) - prevents lag
      const audio = audioPoolRef.current[currentIndexRef.current];

      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(() => {});

      // Move to next audio in pool
      currentIndexRef.current = (currentIndexRef.current + 1) % poolSize;
    }
  }, [poolSize]);

  const pause = useCallback(() => {
    // Pause all instances
    audioPoolRef.current.forEach((audio) => audio.pause());
  }, []);

  const stop = useCallback(() => {
    // Stop and reset all instances
    audioPoolRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    play,
    pause,
    stop,
    audio: audioPoolRef.current[0], // Return first instance for compatibility
  };
}

export default useAudio;

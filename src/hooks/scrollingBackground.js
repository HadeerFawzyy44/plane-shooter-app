import { useEffect, useRef, useCallback } from "react";

// ============================================
// 4. BACKGROUND SCROLL HOOK
// ============================================
export function useScrollingBackground(speed) {
  const bgY1 = useRef(0);
  const bgY2 = useRef(-window.innerHeight);

  const update = useCallback(() => {
    bgY1.current += speed;
    bgY2.current += speed;

    const height = window.innerHeight;
    if (bgY1.current >= height) bgY1.current = -height;
    if (bgY2.current >= height) bgY2.current = -height;
  }, [speed]);

  const reset = useCallback(() => {
    bgY1.current = 0;
    bgY2.current = -window.innerHeight;
  }, []);

  const draw = useCallback((ctx, image, width, height) => {
    ctx.drawImage(image, 0, bgY1.current, width, height);
    ctx.drawImage(image, 0, bgY2.current, width, height);
  }, []);

  return { update, reset, draw, y1: bgY1, y2: bgY2 };
}

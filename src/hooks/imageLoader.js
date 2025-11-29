import { useEffect, useRef, useState } from "react";

/**
 * Optimized image loader - ensures images are fully loaded
 */
export function useImageLoader(sources) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const imagesRef = useRef({});
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Only load once
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let mounted = true;
    let loadedCount = 0;
    let totalImages = 0;

    console.log("🖼️ Starting image loading...");

    // Count total images
    Object.entries(sources).forEach(([key, src]) => {
      if (Array.isArray(src)) {
        totalImages += src.length;
        console.log(`  Loading ${src.length} images for ${key}`);
      } else {
        totalImages += 1;
        console.log(`  Loading 1 image for ${key}`);
      }
    });

    console.log(`📦 Total images to load: ${totalImages}`);

    const checkComplete = () => {
      loadedCount++;
      console.log(`✅ Image loaded (${loadedCount}/${totalImages})`);

      if (loadedCount === totalImages && mounted) {
        console.log("🎉 All images loaded!");
        setLoaded(true);
      }
    };

    const handleError = (src, key) => {
      if (mounted) {
        const err = new Error(`Failed to load ${key}: ${src}`);
        console.error("❌", err.message);
        setError(err);
      }
    };

    // Load images
    Object.entries(sources).forEach(([key, src]) => {
      if (Array.isArray(src)) {
        // Array of images (like enemies)
        imagesRef.current[key] = src.map((imageSrc, index) => {
          const img = new Image();
          img.onload = () => {
            console.log(`  ✓ ${key}[${index}] loaded:`, imageSrc);
            checkComplete();
          };
          img.onerror = () => handleError(imageSrc, `${key}[${index}]`);
          img.src = imageSrc;
          return img;
        });
      } else {
        // Single image
        const img = new Image();
        img.onload = () => {
          console.log(`  ✓ ${key} loaded:`, src);
          checkComplete();
        };
        img.onerror = () => handleError(src, key);
        img.src = src;
        imagesRef.current[key] = img;
      }
    });

    return () => {
      mounted = false;
    };
  }, []); // Empty deps - only run once

  return { images: imagesRef.current, loaded, error };
}

export default useImageLoader;

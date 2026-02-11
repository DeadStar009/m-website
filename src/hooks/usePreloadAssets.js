import { useState, useEffect } from 'react';

/**
 * Custom hook to preload assets with progress tracking
 * @param {Array} assets - Array of asset objects with {type, src, fontFamily?}
 * @returns {Object} - {progress, isLoading, loadedCount, totalCount}
 */
export const usePreloadAssets = (assets = []) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount] = useState(assets.length);

  useEffect(() => {
    if (!assets || assets.length === 0) {
      setProgress(100);
      setIsLoading(false);
      return;
    }

    let loaded = 0;

    const updateProgress = () => {
      loaded++;
      const currentProgress = Math.round((loaded / assets.length) * 100);
      setProgress(currentProgress);
      setLoadedCount(loaded);

      if (loaded === assets.length) {
        setIsLoading(false);
      }
    };

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          updateProgress();
          resolve();
        };
        img.src = src;
      });
    };

    const loadVideo = (src) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.onloadeddata = () => {
          updateProgress();
          resolve();
        };
        video.onerror = () => {
          updateProgress();
          resolve();
        };
        video.src = src;
        video.load();
      });
    };

    const loadAudio = (src) => {
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => {
          updateProgress();
          resolve();
        };
        audio.onerror = () => {
          updateProgress();
          resolve();
        };
        audio.src = src;
        audio.load();
      });
    };

    const loadFont = (fontFamily, src) => {
      return new Promise((resolve) => {
        const font = new FontFace(fontFamily, `url(${src})`);
        font.load()
          .then(() => {
            document.fonts.add(font);
            updateProgress();
            resolve();
          })
          .catch(() => {
            updateProgress();
            resolve();
          });
      });
    };

    const loadAllAssets = async () => {
      const promises = assets.map((asset) => {
        const { type, src, fontFamily } = asset;
        
        switch (type) {
          case 'image':
            return loadImage(src);
          case 'video':
            return loadVideo(src);
          case 'audio':
            return loadAudio(src);
          case 'font':
            return loadFont(fontFamily, src);
          default:
            updateProgress();
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
    };

    loadAllAssets();
  }, [assets]);

  return {
    progress,
    isLoading,
    loadedCount,
    totalCount
  };
};

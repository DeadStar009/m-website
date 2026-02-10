import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Preloader = ({ assets = [], onComplete }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!assets || assets.length === 0) {
      // If no assets to load, complete immediately
      setProgress(100);
      return;
    }

    let loaded = 0;
    const totalAssets = assets.length;
    let isMounted = true;

    // Safety timeout: If loading takes too long (e.g., 10 seconds), force finish
    const safetyTimeout = setTimeout(() => {
        if (isMounted) {
            console.warn("Preloader safety timeout triggered - forcing completion");
            setProgress(100);
        }
    }, 10000);

    // Function to update progress
    const updateProgress = () => {
      if (!isMounted) return;
      loaded++;
      const currentProgress = Math.round((loaded / totalAssets) * 100);
      setProgress(currentProgress);
    };

    // Preload images
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        const done = () => {
            updateProgress();
            resolve(src);
        };
        img.onload = done;
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          done();
        };
        img.src = src;
      });
    };

    // Preload videos
    const loadVideo = (src) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        const done = () => {
            updateProgress();
            resolve(src);
        };
        video.onloadeddata = done;
        video.onerror = () => {
          console.warn(`Failed to load video: ${src}`);
          done();
        };
        video.src = src;
        video.load();
      });
    };

    // Preload audio
    const loadAudio = (src) => {
      return new Promise((resolve) => {
        const audio = new Audio();
        const done = () => {
            updateProgress();
            resolve(src);
        };
        audio.oncanplaythrough = done;
        audio.onerror = () => {
          console.warn(`Failed to load audio: ${src}`);
          done();
        };
        audio.src = src;
        audio.load();
      });
    };

    // Preload fonts
    const loadFont = (fontFamily, src) => {
      return new Promise((resolve) => {
        const font = new FontFace(fontFamily, `url(${src})`);
        const done = () => {
            updateProgress();
            resolve(src);
        };
        font.load()
          .then(() => {
            document.fonts.add(font);
            done();
          })
          .catch(() => {
            console.warn(`Failed to load font: ${src}`);
            done();
          });
      });
    };

    // Start loading all assets
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
    
    return () => {
        isMounted = false;
        clearTimeout(safetyTimeout);
    };
  }, [assets]);

  useEffect(() => {
    if (progress >= 100) {
      // Animate out the preloader
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          },
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="size-full"
          style={{
            backgroundImage: "linear-gradient(to right, #1e3a8a 1px, transparent 1px), linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)",
            backgroundSize: "4rem 4rem"
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 size-96 animate-pulse rounded-full bg-blue-900/20 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 size-96 animate-pulse rounded-full bg-blue-800/20 blur-[100px] animation-delay-2000"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-blue-100 text-sm md:text-base font-mono tracking-widest uppercase animate-pulse">
            Loading Secure Connection...
          </p>
        </div>

        {/* Circular loader */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 md:w-40 md:h-40 -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#1e3a8a"
              strokeOpacity="0.2"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
              className="transition-all duration-300 ease-out"
              style={{
                filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tighter">
              {progress}
              <span className="text-2xl md:text-3xl text-blue-400 ml-1">%</span>
            </span>
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-64 md:w-80 h-1 bg-gray-900 rounded-full overflow-hidden border border-blue-900/50">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce animation-delay-200"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce animation-delay-400"></span>
          </div>
          <p className="text-blue-200/70 text-xs md:text-sm font-mono tracking-widest uppercase">
            Initializing Security Protocols
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Preloader;

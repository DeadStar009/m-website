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

    // Function to update progress
    const updateProgress = () => {
      if (!isMounted) return;
      loaded++;
      const currentProgress = Math.round((loaded / totalAssets) * 100);
      setProgress(currentProgress);
    };

    // Generic fetch-based loader for robust caching
    const loadWithFetch = (src) => {
        return new Promise((resolve) => {
            fetch(src)
                .then(response => {
                    if (!response.ok) throw new Error(`Status ${response.status}`);
                    return response.blob(); // Force full download
                })
                .then(() => {
                    updateProgress();
                    resolve(src);
                })
                .catch((err) => {
                    console.warn(`Failed to fetch asset: ${src}`, err);
                    updateProgress();
                    resolve(src);
                });
        });
    };

    // Preload images - simpler Image object is usually fine, 
    // but fetch ensures 100% data presence for heavy PNG/WEBP
    const loadImage = (src) => {
       return loadWithFetch(src);
    };

    // Preload videos - CRITICAL FIX: Use fetch instead of document.createElement('video')
    // This forces the browser to download the entire file into the disk cache.
    const loadVideo = (src) => {
       return loadWithFetch(src);
    };

    // Preload audio - Use fetch for same reason
    const loadAudio = (src) => {
       return loadWithFetch(src);
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
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden perspective-1000">
      {/* Background with futuristic grid and slight noise */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(30, 58, 138, 0.4) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(30, 58, 138, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "4rem 4rem",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />
        
        {/* Static noise overlay (optional for retro feel) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}>
        </div>
      </div>

      {/* Cyberpunk glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] animate-pulse delay-1000"></div>


      {/* Main content container with glassmorphism */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-12">
        
        {/* LOGO or Emblem (Static Image) */}
        <div className="mb-8 relative group">
           {/* Glitch effect clone on hover or active */}
           <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
           <img 
             src="/img/logo.png" 
             alt="CYSCOM" 
             className="relative h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-float"
           />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 tracking-tighter uppercase font-zentry" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
            Loading
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-blue-500/50"></div>
            <p className="text-blue-300 font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
              Establishing Secure Uplink
            </p>
            <div className="h-px w-8 bg-blue-500/50"></div>
          </div>
        </div>

        {/* Circular loader & Percentage */}
        <div className="relative flex items-center justify-center mb-6">
          <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Outer Ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#1e293b"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
            />
            {/* Inner Background Circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#0f172a"
              strokeWidth="6"
              fill="none"
              className="opacity-50"
            />
            {/* Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="url(#loading-gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
              className="transition-all duration-300 ease-out drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
            <defs>
              <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan 400 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* Blue 500 */}
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-cyan-50">
             <span className="text-4xl font-bold tracking-tighter tabular-nums drop-shadow-md">
               {progress}<span className="text-lg text-cyan-400/80">%</span>
             </span>
          </div>
        </div>

        {/* Terminal / Status Lines (Decorative) */}
        <div className="h-6 w-64 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center animate-slide-up text-[10px] text-blue-400/60 font-mono leading-none gap-1">
                <span>[ OK ] Loading Modules...</span>
                <span>[ OK ] Verifying Assets...</span>
                <span>[ OK ] Decrypting Payload...</span>
                <span>[ OK ] Handshake Complete.</span>
                <span>[ OK ] Access Granted.</span>
            </div>
            {/* Gradient mask for fading text */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        </div>

      </div>

      <style>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slide-up {
            animation: slideUp 2s steps(4, end) infinite;
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(-100%); }
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Preloader;

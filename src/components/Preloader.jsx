import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Preloader = ({ assets = [], onComplete }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [loadedFiles, setLoadedFiles] = useState([]);

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
    const updateProgress = (filename) => {
      if (!isMounted) return;
      loaded++;
      const currentProgress = Math.min(100, Math.round((loaded / totalAssets) * 100));
      console.log(`✓ Loaded (${loaded}/${totalAssets}): ${filename} - ${currentProgress}%`);
      setProgress(currentProgress);
      setLoadedFiles(prev => [...prev, filename]);
    };

    // Preload images - Use Image element for proper caching
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        console.log(`⏳ Loading IMAGE: ${filename}`);
        setCurrentFile(filename);
        
        const startTime = Date.now();
        const img = new Image();
        
        img.onload = () => {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`✅ Image loaded: ${filename} in ${timeTaken}s`);
          updateProgress(filename);
          resolve(src);
        };
        
        img.onerror = (err) => {
          console.error(`❌ Image failed: ${filename}:`, err);
          updateProgress(filename);
          resolve(src);
        };
        
        img.src = src;
      });
    };

    // Preload videos - Use actual video element for proper browser caching
    const loadVideo = (src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        console.log(`⏳ Loading VIDEO: ${filename}`);
        setCurrentFile(filename);
        
        const startTime = Date.now();
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        
        const onReady = () => {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`✅ Video ready: ${filename} in ${timeTaken}s (buffered: ${video.buffered.length > 0 ? 'YES' : 'NO'})`);
          updateProgress(filename);
          // Keep video element in memory briefly to ensure cache
          setTimeout(() => {
            video.src = '';
            video.load();
          }, 100);
          resolve(src);
        };
        
        const onError = (err) => {
          console.error(`❌ Video failed: ${filename}:`, err);
          updateProgress(filename);
          resolve(src);
        };
        
        // Wait for video to be fully buffered and ready to play
        video.addEventListener('canplaythrough', onReady, { once: true });
        video.addEventListener('error', onError, { once: true });
        
        // Fallback if canplaythrough doesn't fire
        setTimeout(() => {
          if (!video.readyState >= 3) {
            console.warn(`⚠️ Fallback triggered for ${filename}`);
            onReady();
          }
        }, 30000);
        
        video.src = src;
        video.load();
      });
    };

    // Preload audio - Use Audio element for proper caching
    const loadAudio = (src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        console.log(`⏳ Loading AUDIO: ${filename}`);
        setCurrentFile(filename);
        
        const startTime = Date.now();
        const audio = new Audio();
        
        const onReady = () => {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`✅ Audio loaded: ${filename} in ${timeTaken}s`);
          updateProgress(filename);
          resolve(src);
        };
        
        const onError = (err) => {
          console.error(`❌ Audio failed: ${filename}:`, err);
          updateProgress(filename);
          resolve(src);
        };
        
        audio.addEventListener('canplaythrough', onReady, { once: true });
        audio.addEventListener('error', onError, { once: true });
        
        audio.src = src;
        audio.load();
      });
    };

    // Preload fonts
    const loadFont = (fontFamily, src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        console.log(`Loading FONT: ${filename}`);
        setCurrentFile(filename);
        
        const font = new FontFace(fontFamily, `url(${src})`);
        const done = () => {
            updateProgress(filename);
            resolve(src);
        };
        font.load()
          .then(() => {
            document.fonts.add(font);
            console.log(`✅ Font loaded: ${filename}`);
            done();
          })
          .catch((err) => {
            console.error(`❌ Failed to load font ${filename}:`, err);
            done();
          });
      });
    };

    // Start loading all assets
    const loadAllAssets = async () => {
      console.log(`Starting preload of ${totalAssets} assets...`);
      console.log('Assets to load:', assets.map(a => a.src).join(', '));
      
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
            const filename = src?.split('/').pop() || 'unknown';
            updateProgress(filename);
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      console.log('🎉 All assets loaded successfully!');
      
      // Extra verification: Wait a bit to ensure browser has everything ready
      console.log('⏳ Waiting for browser to finalize caching...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('✅ Cache verification complete - ready to render!');
    };

    loadAllAssets();
    
    return () => {
        isMounted = false;
    };
  }, [assets]);

  useEffect(() => {
    if (progress >= 100) {
      console.log('📊 Progress 100% - waiting for final verification...');
      // Wait longer after 100% to ensure everything is truly ready
      const timer = setTimeout(() => {
        console.log('🎬 Starting fade-out animation...');
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            console.log('✨ Preloader complete - rendering main content');
            onComplete?.();
          },
        });
      }, 1800);
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

        {/* Current Loading File Display */}
        <div className="w-full max-w-md px-4">
          <div className="bg-slate-900/30 border border-blue-900/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 text-xs font-mono uppercase tracking-wide">Current File</span>
            </div>
            <div className="text-blue-100 text-sm font-mono truncate">
              {currentFile || 'Initializing...'}
            </div>
          </div>
        </div>

        {/* Recently Loaded Files (Last 3) */}
        <div className="w-full max-w-md px-4 mt-3">
          <div className="flex flex-col gap-1">
            {loadedFiles.slice(-3).reverse().map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px] font-mono text-blue-400/60 animate-fade-in">
                <span className="text-green-400">\u2713</span>
                <span className="truncate">{file}</span>
              </div>
            ))}
          </div>
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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Preloader;

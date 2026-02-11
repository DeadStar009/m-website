import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Preloader = ({ assets = [], onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [terminalGibberish, setTerminalGibberish] = useState('');
  const [cacheVerified, setCacheVerified] = useState(false);
  const gibberishIntervalRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  // Generate random terminal-style file loading messages
  const generateGibberish = () => {
    const dllFiles = [
      'kernel32.dll', 'user32.dll', 'gdi32.dll', 'advapi32.dll', 'shell32.dll',
      'ole32.dll', 'oleaut32.dll', 'msvcrt.dll', 'comdlg32.dll', 'winmm.dll',
      'ws2_32.dll', 'opengl32.dll', 'ntdll.dll', 'bcrypt.dll', 'crypt32.dll',
      'urlmon.dll', 'winhttp.dll', 'msvcp140.dll', 'vcruntime140.dll'
    ];
    
    const jsxFiles = [
      'App.jsx', 'Hero.jsx', 'Navbar.jsx', 'Footer.jsx', 'Button.jsx',
      'Features.jsx', 'Story.jsx', 'Contact.jsx', 'About.jsx', 'OurTeam.jsx',
      'AnimatedTitle.jsx', 'VideoPreview.jsx', 'PastEvents.jsx', 'Preloader.jsx',
      'ParticleBackground.jsx', 'ScrollToTop.jsx', 'newstick.tsx', 'sticky_scroll.jsx'
    ];
    
    const prefixes = ['Loading', 'Initializing', 'Mounting', 'Rendering', 'Importing'];
    const statuses = ['OK', 'DONE', 'READY', 'LOADED'];
    
    const fileType = Math.random() > 0.5 ? dllFiles : jsxFiles;
    const file = fileType[Math.floor(Math.random() * fileType.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return `${prefix} ${file}... [${status}]`;
  };

  // Start terminal gibberish animation
  useEffect(() => {
    gibberishIntervalRef.current = setInterval(() => {
      setTerminalGibberish(generateGibberish());
    }, 80);

    return () => {
      if (gibberishIntervalRef.current) {
        clearInterval(gibberishIntervalRef.current);
      }
    };
  }, []);

  // Particle system initialization and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = 100;
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle());

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections near mouse
      const mouse = mouseRef.current;
      const connectionDistance = 150;
      
      particlesRef.current.forEach((particle, i) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          // Connect particle to mouse
          const opacity = (1 - distance / connectionDistance) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Connect nearby particles to each other
          particlesRef.current.slice(i + 1).forEach(otherParticle => {
            const dx2 = particle.x - otherParticle.x;
            const dy2 = particle.y - otherParticle.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (distance2 < 100) {
              const opacity2 = (1 - distance2 / 100) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity2})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!assets || assets.length === 0) {
      // If no assets to load, complete immediately
      setProgress(100);
      return;
    }

    let loaded = 0;
    const totalAssets = assets.length;
    let isMounted = true;

    // Function to update progress (assets take 0-95%, cache verification takes 95-100%)
    const updateProgress = (filename) => {
      if (!isMounted) return;
      loaded++;
      // Ensure progress never exceeds 95 during asset loading
      const currentProgress = Math.min(95, Math.round((loaded / totalAssets) * 95));
      setProgress(currentProgress);
      setLoadedFiles(prev => [...prev, filename]);
    };

    // Preload images - Use Image element for proper caching
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        setCurrentFile(filename);
        
        const startTime = Date.now();
        const img = new Image();
        
        img.onload = () => {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          updateProgress(filename);
          resolve(src);
        };
        
        img.onerror = (err) => {
          updateProgress(filename);
          resolve(src);
        };
        
        // Use full URL for dynamically created image element
        const imgUrl = new URL(src, window.location.origin).href;
        img.src = imgUrl;
      });
    };

    // Preload videos - Use actual video element for proper browser caching
    const loadVideo = (src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        setCurrentFile(filename);
        
        const startTime = Date.now();
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        
        const onReady = () => {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          updateProgress(filename);
          // Keep video element in memory briefly to ensure cache
          setTimeout(() => {
            video.src = '';
            video.load();
          }, 100);
          resolve(src);
        };
        
        const onError = (err) => {
          updateProgress(filename);
          resolve(src);
        };
        
        // Wait for video to be fully buffered and ready to play
        video.addEventListener('canplaythrough', onReady, { once: true });
        video.addEventListener('error', onError, { once: true });
        
        // Fallback if canplaythrough doesn't fire
        setTimeout(() => {
          if (!video.readyState >= 3) {
            onReady();
          }
        }, 30000);
        

        const videoUrl = new URL(src, window.location.origin).href;
        video.src = videoUrl;
        video.load();
      });
    };

    // Preload audio - Use Audio element for proper caching
    const loadAudio = (src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        setCurrentFile(filename);
        
        const startTime = Date.now();
        const audio = new Audio();
        
        const onReady = () => {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          updateProgress(filename);
          resolve(src);
        };
        
        const onError = (err) => {
          updateProgress(filename);
          resolve(src);
        };
        
        audio.addEventListener('canplaythrough', onReady, { once: true });
        audio.addEventListener('error', onError, { once: true });
        
        // Use full URL for dynamically created audio element
        const audioUrl = new URL(src, window.location.origin).href;
        audio.src = audioUrl;
        audio.load();
      });
    };

    // Preload fonts
    const loadFont = (fontFamily, src) => {
      return new Promise((resolve) => {
        const filename = src.split('/').pop();
        setCurrentFile(filename);
        
        const font = new FontFace(fontFamily, `url(${src})`);
        const done = () => {
            updateProgress(filename);
            resolve(src);
        };
        font.load()
          .then(() => {
            document.fonts.add(font);
            done();
          })
          .catch((err) => {
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
            const filename = src?.split('/').pop() || 'unknown';
            updateProgress(filename);
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      // GSAP initialization check
      if (isMounted) setProgress(Math.min(100, 96));
      
      // Ensure ScrollTrigger is ready
      await new Promise(resolve => {
        if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTrigger) {
          resolve();
        } else {
          resolve();
        }
      });
      
      // Extra verification: Wait a bit to ensure browser has everything ready
      if (isMounted) setProgress(Math.min(100, 97));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Signal that cache verification is done and set to 100%
      if (isMounted) {
        setProgress(100);
        setCacheVerified(true);
      }
    };

    loadAllAssets();
    
    return () => {
        isMounted = false;
    };
  }, [assets]);

  useEffect(() => {
    // Only start fade-out when BOTH conditions are met:
    // 1. Progress is 100%
    // 2. Cache verification is complete
    if (progress >= 100 && cacheVerified) {
      // Brief delay for smooth transition
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          },
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, cacheVerified, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden perspective-1000">
      {/* Interactive Particle Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Background with futuristic grid and slight noise */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
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
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ zIndex: 0 }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] animate-pulse delay-1000" style={{ zIndex: 0 }}></div>


      {/* Main content container with glassmorphism */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-12">

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

        {/* Terminal Gibberish Display */}
        <div className="w-full max-w-md px-4">
          <div className="bg-slate-900/30 border border-blue-900/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 text-xs font-mono uppercase tracking-wide">System Process</span>
            </div>
            <div className="text-green-400 text-sm font-mono truncate">
              {terminalGibberish || 'Initializing...'}
            </div>
          </div>
        </div>

        {/* Loading Files Display (Last 3) */}
        <div className="w-full max-w-md px-4 mt-3">
          <div className="text-cyan-300/70 text-[10px] font-mono uppercase tracking-wide mb-1 px-1">Loading files:</div>
          <div className="flex flex-col gap-1">
            {loadedFiles.slice(-3).reverse().map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px] font-mono text-blue-400/60 animate-fade-in">
                <span className="text-green-400">✓</span>
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

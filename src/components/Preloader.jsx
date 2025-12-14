import { useEffect, useState } from "react";
import gsap from "gsap";

const Preloader = ({ progress = 0, onComplete }) => {
  useEffect(() => {
    if (progress >= 100) {
      // Animate out the preloader
      const timer = setTimeout(() => {
        gsap.to(".preloader", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete();
          },
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="preloader fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-600/20 blur-[100px] animation-delay-2000"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-4">
          {/* <h1 className="special-font text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 animate-pulse">
            CYS<span className="text-blue-500">C</span>OM
          </h1> */}
          <p className="text-blue-300/80 text-sm md:text-base font-mono tracking-wider">
            LOADING SECURE CONNECTION...
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
              stroke="rgba(59, 130, 246, 0.2)"
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
              className="transition-all duration-500 ease-in-out"
              style={{
                filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-blue-400 font-mono">
              {progress}
              <span className="text-2xl md:text-3xl text-cyan-400">%</span>
            </span>
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-64 md:w-80 h-1 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-blue-900/30">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-full transition-all duration-500 ease-in-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce animation-delay-200"></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></span>
          </div>
          <p className="text-blue-400/60 text-xs md:text-sm font-mono tracking-widest">
            INITIALIZING SECURITY PROTOCOLS
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
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

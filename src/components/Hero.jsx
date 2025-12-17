import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useRef, useState, useEffect } from "react";

import Button from "./Button";
import ParticleBackground from "./ParticleBackground";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHacked, setIsHacked] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  const handleVideoLoad = () => {
    // Finalize progress to 100 when video is ready
    setProgress(100);
    setLoading(false);
  };

  // Prevent scrolling while hero is loading
  useGSAP(() => {
    if (loading) {
      gsap.set("body", { overflow: "hidden" });
    } else {
      gsap.set("body", { overflow: "auto" });
    }
  }, [loading]);

  // Smoothly ramp progress from 0 to ~90% until ready
  useEffect(() => {
    if (!loading) return;
    let rafId;
    let current = 0;
    const tick = () => {
      // Ease-in-out ramp; cap at 90 until handleVideoLoad sets 100
      current = Math.min(90, current + (current < 50 ? 2.2 : 1.2));
      setProgress(Math.floor(current));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loading]);

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div id="hero" className="relative h-dvh overflow-x-hidden bg-black">
      {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-600/20 blur-[100px]" style={{ animationDelay: '2s' }}></div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo/Title */}
            <div className="flex flex-col items-center gap-4">
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
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <p className="text-blue-400/60 text-xs md:text-sm font-mono tracking-widest">
                INITIALIZING SECURITY PROTOCOLS
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black"
      >
        {videoEnded && <ParticleBackground />}
        
        <video
          ref={videoRef}
          src="videos/main.webm"
          preload="auto"
          autoPlay
          
          muted
          playsInline
          disableRemotePlayback
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
          onEnded={() => setVideoEnded(true)}
          style={{ display: videoEnded ? 'none' : 'block' }}
        />

        <div className="absolute left-0 top-0 z-40 flex size-full flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="special-font hero-heading relative text-blue-100">
              {/* <img
                src="/img/logo.png"
                alt="CYSCOM Logo"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                className="absolute inset-0 size-full object-cover opacity-30"
              /> */}
              <span className="relative z-10">CYS<b>C</b>OM</span>  
            </h1>

            <p className="hero-text mb-5 max-w-64 md:max-w-md font-robert-regular text-blue-100 text-sm md:text-base px-4">
              Think Before You Click <br /> CyberSecurity Student Committee
            </p>

            <div className="flex justify-center">
              <Button
                id="watch-trailer"
                title={isHacked ? "You are hacked!" : "Click here"}
                leftIcon={isHacked ? null : <TiLocationArrow />}
                containerClass={`${isHacked ? 'bg-red-600 text-white' : 'bg-yellow-300 text-black'} flex-center gap-1`}
                onClick={() => setIsHacked(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

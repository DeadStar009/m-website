import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useRef, useState, useEffect } from "react";

import Button from "./Button";
import ParticleBackground from "./ParticleBackground";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isHacked, setIsHacked] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [hackingInProgress, setHackingInProgress] = useState(false);
  const [fullHacked, setFullHacked] = useState(false);
  const videoRef = useRef(null);

  const handleHackClick = () => {
    setIsHacked(true);
    setGlitchActive(true);
    
    // Stop glitch after 1 second
    setTimeout(() => {
      setGlitchActive(false);
      setHackingInProgress(true);
    }, 1000);
    
    // Show full hack screen after 4-5 seconds
    setTimeout(() => {
      setFullHacked(true);
    }, 5000);
  };

  // Prevent scrolling while hero is loading (optional, removed for single preloader)
  // useGSAP(() => { ... }); 

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
      {/* Glitch Overlay - Edge flashing effect */}
      {glitchActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="glitch-border-animation absolute inset-0"></div>
        </div>
      )}

      {/* Full Hacked Screen - Terminal with Background Image */}
      {fullHacked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-start overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/hacked.webp')" }}
          ></div>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Scanline effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none scanlines"></div>
          
          {/* Terminal content - shifted left */}
          <div className="relative z-10 text-left font-mono p-8 ml-8 md:ml-16 lg:ml-24">
            <div className="text-6xl md:text-8xl font-bold text-white mb-8 glitch-text">
              YOU ARE NOW HACKED
            </div>
            <div className="text-xl md:text-2xl text-white opacity-90 mb-4">
              &gt; SYSTEM COMPROMISED
            </div>
            <div className="text-lg md:text-xl text-white opacity-80">
              &gt; THINK BEFORE YOU CLICK
            </div>
            <div className="mt-8 text-sm text-white opacity-70 animate-pulse">
              [TERMINAL_ID: 0x{Math.random().toString(16).substr(2, 8).toUpperCase()}]
            </div>
          </div>
        </div>
      )}

      {/* Hacking in progress overlay */}
      {hackingInProgress && !fullHacked && (
        <div className="fixed inset-0 z-[9998] bg-black bg-opacity-80 flex items-center justify-center">
          <div className="text-green-400 font-mono text-center">
            <div className="text-2xl md:text-4xl mb-4 animate-pulse">
              &gt; INITIATING BREACH...
            </div>
            <div className="text-sm md:text-base opacity-70">
              &gt; Creating firewall exception...
              <br />
              &gt; Deploying Rootkit...
              <br />
              &gt; Creating Connection...
            </div>
          </div>
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glitch-border {
          0%, 100% {
            box-shadow: 
              inset 0 0 0 5px rgba(255, 0, 0, 0.8),
              inset 0 0 0 10px rgba(0, 255, 0, 0.8),
              inset 0 0 0 15px rgba(0, 0, 255, 0.8);
          }
          25% {
            box-shadow: 
              inset 0 0 0 8px rgba(0, 255, 0, 0.9),
              inset 0 0 0 16px rgba(255, 0, 0, 0.9),
              inset 0 0 0 24px rgba(0, 0, 255, 0.9);
          }
          50% {
            box-shadow: 
              inset 0 0 0 3px rgba(0, 0, 255, 1),
              inset 0 0 0 6px rgba(255, 0, 0, 1),
              inset 0 0 0 9px rgba(0, 255, 0, 1);
          }
          75% {
            box-shadow: 
              inset 0 0 0 12px rgba(255, 0, 0, 0.7),
              inset 0 0 0 24px rgba(0, 0, 255, 0.7),
              inset 0 0 0 36px rgba(0, 255, 0, 0.7);
          }
        }
        
        .glitch-border-animation {
          animation: glitch-border 0.1s infinite;
          pointer-events: none;
        }
        
        @keyframes scanline {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
        
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          animation: scanline 8s linear infinite;
        }
        
        @keyframes glitch-text {
          0%, 100% {
            text-shadow: 
              2px 2px 0 rgba(255, 0, 0, 0.7),
              -2px -2px 0 rgba(0, 255, 0, 0.7);
          }
          25% {
            text-shadow: 
              -2px 2px 0 rgba(0, 255, 0, 0.7),
              2px -2px 0 rgba(255, 0, 0, 0.7);
          }
          50% {
            text-shadow: 
              2px -2px 0 rgba(255, 0, 0, 0.7),
              -2px 2px 0 rgba(0, 255, 0, 0.7);
          }
          75% {
            text-shadow: 
              -2px -2px 0 rgba(0, 255, 0, 0.7),
              2px 2px 0 rgba(255, 0, 0, 0.7);
          }
        }
        
        .glitch-text {
          animation: glitch-text 0.3s infinite;
        }
      `}</style>
      
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black"
      >
        {videoEnded && <ParticleBackground />}
        
        <video
          ref={videoRef}
          src="/videos/main.webm"
          preload="auto"
          autoPlay
          
          muted
          playsInline
          disableRemotePlayback
          className="absolute left-0 top-0 size-full object-cover object-center"
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
                onClick={handleHackClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

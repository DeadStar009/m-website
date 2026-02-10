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
  const videoRef = useRef(null);

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
      {/* {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
          ... removed old inline preloader ...
        </div>
      )} */}

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

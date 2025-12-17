import gsap from "gsap";
import { useRef } from "react";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

const FloatingImage = () => {
  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.parentElement.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -10;
    const rotateY = ((xPos - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <div id="story" className="min-h-dvh w-screen bg-black text-blue-50 cyber-grid relative">
      <div className="section-divider absolute top-0" />
      <div className="flex size-full flex-col items-center py-8 md:py-20 pb-16 md:pb-32 px-4">
        <p className="font-general text-xs md:text-sm uppercase text-glow animate-fade-in-up">
          From challenge to clarity
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="Access our <br />Ctf writeups here"
            containerClass="mt-8 md:mt-16 pointer-events-none mix-blend-difference relative z-10"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div
                className="story-img-content"
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseLeave}
                onMouseEnter={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  ref={frameRef}
                  src="/img/fast.webp"
                  alt="/img/fast.webp"
                  loading="lazy"
                  decoding="async"
                  className="object-contain w-full h-full"
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                />
              </div>
            </div>

            {/* for the rounded corner */}
            {/* <svg
              className="invisible absolute size-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="8"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="flt_tag"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg> */}
          </div>
        </div>

        {/* <div className="animate-fade-in-up mt-12" style={{ animationDelay: '0.4s' }}>
          <Button 
            title="Discover More" 
            containerClass="" 
          />
        </div> */}
      </div>
      <div className="section-divider absolute bottom-0" />
    </div>
  );
};

export default FloatingImage;
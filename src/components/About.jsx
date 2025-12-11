import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen  bg-black">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm text-white uppercase md:text-[10px]">
          Welcome to CYSCOM
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the VIT'S <br /> ONLY CYBERSECURITY <b>C</b>LUB"
          containerClass="mt-5 !text-white text-center"
        />

        <div className="about-subtext text-white">
          <p>The Game of Defense begins—your life, now an epic CTF</p>
          <p className="text-white">
            CYSCOM unifies people from different domains on the aspect of CyberSecurity issues arising due to recent practices.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/mid.jpg"
            alt="Background"
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;

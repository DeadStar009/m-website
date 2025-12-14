import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  { name: "Member 1", role: "President", img: "/img/gallery-1.webp" },
  { name: "Member 2", role: "Vice President", img: "/img/gallery-2.webp" },
  { name: "Member 3", role: "Tech Lead", img: "/img/gallery-3.webp" },
  { name: "Member 4", role: "Design Lead", img: "/img/gallery-4.webp" },
  { name: "Member 5", role: "Web Lead", img: "/img/gallery-5.webp" },
  { name: "Member 6", role: "Event Lead", img: "/img/gallery-1.webp" },
  { name: "Member 7", role: "Content Lead", img: "/img/gallery-2.webp" },
  { name: "Member 8", role: "Marketing Lead", img: "/img/gallery-3.webp" },
];

const OurTeam = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animations for "WHO ARE WE"
      const titles = gsap.utils.toArray(".who-we-are-container");
      
      titles.forEach((container, i) => {
        const block = container.querySelector(".block-revealer");
        const text = container.querySelector(".who-we-are-title");
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".title-wrapper",
                start: "top 80%",
            },
            delay: i * 0.15 
        });

        tl.set(text, { opacity: 1 }); // Ensure text is technically "there" but clipped or covered

        // Block grows from left
        tl.fromTo(block, 
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 0.8, ease: "power3.inOut" }
        )
        // Block shrinks to right, revealing text
        .fromTo(block,
            { scaleX: 1, transformOrigin: "right" },
            { scaleX: 0, duration: 0.8, ease: "power3.inOut" }
        );
        
        // Text reveals with clip-path (L->R) and slides down (Up->Down)
        tl.fromTo(text,
            { clipPath: "inset(0 100% 0 0)", y: -20 },
            { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.0, ease: "power3.out" },
            "-=0.4" // Overlap with block shrinking
        );
      });

      // Image reveal
      gsap.fromTo(
        ".team-image",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".team-image-wrapper",
            start: "top 70%",
          },
        }
      );
      
      // Intro text fade up
      gsap.fromTo(
        ".intro-text",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          scrollTrigger: {
            trigger: ".intro-wrapper",
            start: "top 85%",
          },
        }
      );

       // Team grid animation
       gsap.fromTo(
        ".team-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".team-grid",
            start: "top 80%",
          },
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-black min-h-screen text-blue-50 pt-16 md:pt-32 px-3 md:px-6 lg:px-20 overflow-x-hidden">
      {/* Who We Are Section */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-10 mb-8 md:mb-20">
        <div className="team-image-wrapper md:w-3/5 relative overflow-hidden rounded-lg h-[40vh] md:h-[60vh]">
           <img
            src="/img/team018.jpg" 
            alt="Team"
            className="team-image w-full h-full object-cover"
          />
        </div>
        
        <div className="title-wrapper flex flex-col justify-center overflow-hidden pl-0 md:pl-10">
          {Array(4).fill("WHO ARE WE").map((item, i) => (
            <div key={i} className="who-we-are-container relative inline-block w-fit mb-1">
              <h1 className="who-we-are-title font-zentry text-4xl md:text-7xl lg:text-9xl uppercase leading-[0.8] italic tracking-tight opacity-0 text-blue-100">
                {item}
              </h1>
              <div className="block-revealer absolute inset-0 bg-[#38efe6] z-10 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

     
      

      {/* Team Grid */}
      <h2 className="font-zentry text-3xl md:text-5xl lg:text-6xl mb-6 md:mb-10 text-center uppercase">Our Team</h2>
      <div className="team-grid grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 pb-12 md:pb-20">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card group relative overflow-hidden rounded-xl bg-blue-900/20 border border-white/10">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="font-zentry text-2xl uppercase">{member.name}</h3>
              <p className="font-general text-sm text-blue-200">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default OurTeam;

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";

// Matrix Rain Effect Component
const MatrixRain = ({ isVisible }) => {
  const [chars, setChars] = useState([]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const newChars = [];
    
    for (let i = 0; i < 15; i++) {
      newChars.push({
        id: i,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2
      });
    }
    
    setChars(newChars);
    
    const interval = setInterval(() => {
      setChars(prev => prev.map(char => ({
        ...char,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
      })));
    }, 150);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="matrix-bg">
      {chars.map(({ id, char, left, delay }) => (
        <div
          key={id}
          className="matrix-char"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`
          }}
        >
          {char}
        </div>
      ))}
    </div>
  );
};

// Typewriter Effect Hook
const useTypewriter = (text, speed = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const startTyping = () => {
    setIsTyping(true);
    setDisplayText('');
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);
    
    return () => clearInterval(timer);
  };
  
  return { displayText, isTyping, startTyping };
};

gsap.registerPlugin(ScrollTrigger);

const EventCard = ({ name, date, description, image }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const cardRef = useRef(null);
  const { displayText, isTyping, startTyping } = useTypewriter(name, 150);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;

    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 8;
    const tiltY = (relativeX - 0.5) * -8;

    const newTransform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    setTransformStyle(newTransform);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowMatrix(true);
    startTyping();
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
    setIsHovered(false);
    setShowMatrix(false);
  };

  return (
    <div
      ref={cardRef}
      className={`crypto-card group relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-500 hover:scale-105`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-event-card
      style={{ 
        transform: transformStyle,
        transitionProperty: 'transform, border-color',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease-out',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-all duration-500" />
      
      {/* Matrix Rain Effect */}
      <MatrixRain isVisible={showMatrix} />
      
      <div className="relative z-10">
        {/* Event Details */}
        <div className="space-y-4 relative z-10">
          <h3 className={`crypto-title text-xl font-black uppercase transition-colors duration-300 md:text-2xl ${
            isTyping ? 'typing' : ''
          } text-blue-100`}>
            {isHovered ? displayText : name}
          </h3>
          
          <p className="font-general text-xs uppercase tracking-wider text-blue-300/70 transition-colors duration-300">
            <span className="text-blue-400">&gt;</span> {date}
          </p>
          
          <p className="font-circular-web text-sm leading-relaxed text-blue-50/70 transition-colors duration-300 group-hover:text-blue-50/90 border-l-2 border-blue-400/50 pl-3">
            {description}
          </p>
          
          {/* Subtle status indicator */}
          <div className="flex items-center space-x-2 font-general text-xs">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isHovered ? 'bg-blue-400 animate-pulse' : 'bg-blue-400'
            }`} />
            <span className="text-blue-400">
              {isHovered ? 'LOADING...' : 'READY'}
            </span>
          </div>
        </div>
      </div>


      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>
    </div>
  );
};

const PastEvents = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('[data-event-card]');
    
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=50",
          end: "top center",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        rotateX: -10,
        duration: 0.6,
        ease: "power2.out",
        delay: (index % 4) * 0.15, // Stagger based on position in row
      });
    });
  }, { scope: sectionRef });

  const events = [
    {
      name: "Cyber Defender",
      date: "April 19-20, 2022",
      description: "A 2-day technical and fun event for cyber enthusiasts, including a workshop and CTF.",
      image: "/img/logo.png"
    },
    {
      name: "HackOverflow",
      date: "September 27 - October 2, 2022",
      description: "Flagship hackathon with an online ideathon and 24-hour offline event focused on NGO technological problems, with a ₹25,000 prize pool.",
      image: "/img/logo.png"
    },
    {
      name: "CodeNConquer",
      date: "November 15, 2024",
      description: "An intensive coding competition testing algorithmic skills and problem-solving abilities.",
      image: "/img/gallery-2.webp"
    },
    {
      name: "CyberConverge",
      date: "September 20, 2024",
      description: "CTF and hacking event with learning and collaboration opportunities for cybersecurity enthusiasts.",
      image: "/img/gallery-3.webp"
    },
    {
      name: "Intrusion",
      date: "August 11, 2024",
      description: "A comprehensive cybersecurity workshop and CTF challenge focused on penetration testing.",
      image: "/img/gallery-4.webp"
    },
    {
      name: "HackFiesta'24",
      date: "December 1-2, 2024",
      description: "Our flagship 24-hour hackathon featuring innovative projects and collaborative problem-solving.",
      image: "/img/gallery-5.webp"
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="past-events"
      className="min-h-screen bg-black pb-32 pt-20 cyber-grid relative"
    >
      <div className="section-divider absolute top-0" />
      <div className="container mx-auto px-5 md:px-10">
        
        {/* Section Header */}
        <div className="mb-24 flex flex-col items-center gap-8 text-center">
          <p className="font-general text-sm uppercase tracking-wider text-blue-300 md:text-base animate-fade-in-up">
            Our Journey
          </p>

          <AnimatedTitle
            title="P<b>a</b>st Ev<b>e</b>nts <br /> Th<b>r</b>ough the Ye<b>a</b>rs"
            containerClass="mt-5 !text-blue-100 text-center"
          />

          <p className="mt-5 max-w-2xl font-circular-web text-lg text-blue-50/70">
            Explore the legacy of CYSCOM through our flagship events, workshops, and conferences 
            that have shaped the cybersecurity community at VIT Chennai.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event, index) => (
            <EventCard
              key={index}
              name={event.name}
              date={event.date}
              description={event.description}
              image={event.image}
            />
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-20 text-center">
          <p className="font-circular-web text-base text-blue-50/50">
            Many more events and memories to come...
          </p>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;

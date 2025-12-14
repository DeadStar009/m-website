import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={
        `${className} transition-all duration-300 border-2 border-transparent rounded-xl bg-black/80 shadow-lg overflow-hidden ` +
        `hover:scale-105 hover:border-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-pink-500/30`
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, boxShadow: '0 4px 24px 0 rgba(236,72,153,0.15)' }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full group transition-all duration-300 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-black shadow-lg hover:scale-105 hover:shadow-pink-500/30 hover:ring-2 hover:ring-pink-400">
      {src.endsWith('.mp4') || src.endsWith('.webm') ? (
        <video
          src={src}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      ) : (
        <img
          src={src}
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      )}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font drop-shadow-[4px_4px_4px_rgba(0,0,0,0.9)]">{title}</h1>
          {description && (
            <p className="mt-3 max-w-80 text-xs md:text-base drop-shadow-[4px_4px_4px_rgba(0,0,0,0.9)]">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
      {/* Mobile toggle for description */}
      {description && (
        <div className="mt-3 block md:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs uppercase tracking-wide text-blue-200 underline underline-offset-4"
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>
          <div className={`transition-all duration-300 text-blue-100/80 text-sm leading-relaxed ${isExpanded ? 'max-h-48 mt-2 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {description}
          </div>
        </div>
      )}
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-20 md:pb-52 cyber-grid relative">
    <div className="section-divider absolute top-0" />
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-3 md:px-5 py-12 md:py-40">
        <p className="font-circular-web text-lg md:text-xl text-blue-50 text-glow animate-fade-in-up">
          Into the SECURITY Layer
        </p>
        <p className="max-w-2xl font-circular-web text-sm md:text-lg text-blue-50/70 opacity-90 mt-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Immerse yourself in a rich and ever-expanding universe where vulnerabilities await to be cracked, converging into an interconnected overlay experience on your world.
        </p>
      </div>
      <a
        href="https://blog.cyscomvit.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block size-full"
      >
      <BentoTilt className="border-hsla relative mb-4 md:mb-7 h-64 md:h-96 lg:h-[65vh] w-full overflow-hidden rounded-md">
        <BentoCard
          src="img/newsletter.webp"
          title={
            <>
              Mont<b>h</b>ly High<b>l</b>ights
            </>
          }
          description="Because the cyber world never sleeps — and neither do we. From threats to trends, from skills to stories — your cyber journey grows with every scroll. Welcome to this month’s edition."
          // isComingSoon
        />
      </BentoTilt>
        
      </a>
   
      <div className="grid h-auto md:h-[135vh] w-full grid-cols-2 grid-rows-auto md:grid-rows-3 gap-3 md:gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 col-span-2 md:col-span-1 md:row-span-2 h-48 md:h-auto">
          <a
            href="https://blog.cyscomvit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block size-full"
          >
          <BentoCard
            src="videos/feature-2.mp4"
            title={
              <>
                CT<b>F</b>s AND EV<b>E</b>NTS
              </>
            }
            description="Not just a challenge — it’s a journey.
Every event helps you grow, hack smarter, and think deeper.
And the next one? Already on the way."
            // isComingSoon
          />

          </a>
        </BentoTilt>
        

        <BentoTilt className="bento-tilt_1 row-span-1 col-span-1 md:col-span-1 h-48 md:h-auto">
          <a
            href="https://blog.cyscomvit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block size-full"
          >

          <BentoCard
            src="videos/feature-4.mp4"
            title={
              <>
                PROJE<b>C</b>TS
              </>
            }
            description="Every project is a step forward in skill, creativity, and cybersecurity. Built, tested, and refined by our chapter."
            // isComingSoon
          />


          </a>
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-1 md:col-span-1 h-48 md:h-auto">
          <a
            href="https://blog.cyscomvit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block size-full"
          >
            <BentoCard
              src="img/leaderboard2.webp"
              title={
                <>
                  LEADER<b>B</b>OARD
                </>
              }
              description= "Each event shapes the leaderboard. Will the next flag push you higher?"
              // isComingSoon
            />

          </a>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-[#ffffff] p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 col-span-1 h-48 md:h-auto">
          <a
            href="https://blog.cyscomvit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block size-full"
          >
            <BentoCard src="img/blogs.jpg" />
          </a>
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;

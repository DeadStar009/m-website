import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "./Button";

const navItems = ["Home", "Our Team", "LeaderBoard", "Blogs", "About"];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [isNavVisible]);

  const handleNavigate = (item) => {
    if (item === "Our Team") {
      navigate("/our-team");
      window.scrollTo(0, 0);
      return;
    }

    if (item === "LeaderBoard") {
      window.open("https://opensrc.cyscomvit.com/leaderboard", "_blank");
      return;
    }

    if (item === "Blogs") {
      window.open("https://blog.cyscomvit.com/", "_blank");
      return;
    }

    const targetId = item === "Home" ? "video-frame" : item.toLowerCase().replace(" ", "-");

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-4 md:gap-7">
            <img src="/img/logo.png" alt="logo" className="w-8 md:w-10 rounded-full" loading="lazy" decoding="async" fetchPriority="low" />

            <Button
              id="product-button"
              title="Recruitments"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-blue-50 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-blue-50 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-blue-50 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Navigation Links and Audio Button */}
            <div className="hidden md:flex h-full items-center">
            <div className="md:flex md:items-center md:gap-1">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item === "Home" ? "hero" : item.toLowerCase().replace(" ", "-")}`}
                  className="nav-hover-btn scroll-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item);
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-lg z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center justify-center h-full gap-8 pt-20 px-8 text-center">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item === "Home" ? "hero" : item.toLowerCase().replace(" ", "-")}`}
                  className="text-2xl font-zentry text-blue-50 hover:text-blue-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    handleNavigate(item);
                  }}
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-3 items-center w-full">
                <button
                  onClick={() => setIsQuickNavOpen(!isQuickNavOpen)}
                  className="w-full max-w-xs rounded-full border border-blue-500/40 px-4 py-2 text-blue-50 text-sm flex items-center justify-between"
                >
                  Quick Sections
                  <span className="text-lg">{isQuickNavOpen ? '−' : '+'}</span>
                </button>
                <div className={`w-full max-w-xs overflow-hidden transition-all duration-300 ${isQuickNavOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {navItems.map((item, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-50 text-xs"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleNavigate(item);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleAudioIndicator}
                className="mt-6 flex items-center space-x-0.5"
              >
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;

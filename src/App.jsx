import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/all";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PastEvents from "./components/PastEvents";
import ScrollToTop from "./components/ScrollToTop";
import { StickyScrollRevealDemo } from "./components/sticky_scroll";
import OurTeam from "./components/OurTeam";
import Preloader from "./components/Preloader";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [gsapReady, setGsapReady] = useState(false);

  // Define all assets to preload from Hero, Features, Story, Navbar, etc.
  const assets = [
    // Hero Video
    { type: 'video', src: '/videos/main.webm' },
    // Features Assets
    { type: 'image', src: '/img/newsletter.webp' },
    { type: 'video', src: '/videos/ctf.webm' },
    { type: 'video', src: '/videos/proj.webm' },
    { type: 'image', src: '/img/leaderboard2.webp' },
    { type: 'image', src: '/img/blogs.webp' },
    // Story Asset
    { type: 'image', src: '/img/fast.webp' },
    // About Asset
    { type: 'image', src: '/img/mid.webp' },
    // Contact Assets
    { type: 'image', src: '/img/contact-1.webp' },
    { type: 'image', src: '/img/contact-2.webp' },
    { type: 'image', src: '/img/swordman-partial.webp' },
    { type: 'image', src: '/img/swordman.webp' },
    // Navbar/Global Assets
    { type: 'image', src: '/img/logo.png' },
  ];

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // Let DOM render, then refresh ScrollTrigger calculations
    setTimeout(() => {
      setGsapReady(true);
      if (ScrollTrigger) {
        console.log('🔄 Refreshing ScrollTrigger after content render...');
        ScrollTrigger.refresh();
      }
    }, 100);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {isLoading ? (
        <Preloader assets={assets} onComplete={handlePreloaderComplete} />
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={
              <>
                <Hero gsapReady={gsapReady} />
                <About gsapReady={gsapReady} />
                <div className="relative">
                  <Features />
                  <Story />
                  <StickyScrollRevealDemo />
                  <PastEvents />
                  <Contact />
                  <Footer />
                </div>
              </>
            } />
            <Route path="/our-team" element={<OurTeam />} />
          </Routes>
          <ScrollToTop />
        </>
      )}
    </main>
  );
}

export default App;

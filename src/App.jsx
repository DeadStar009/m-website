import { Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load heavy components below the fold
const About = lazy(() => import("./components/About"));
const Features = lazy(() => import("./components/Features"));
const Story = lazy(() => import("./components/Story"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const PastEvents = lazy(() => import("./components/PastEvents"));
const OurTeam = lazy(() => import("./components/OurTeam"));
const StickyScrollRevealDemo = lazy(() => import("./components/sticky_scroll").then(module => ({ default: module.StickyScrollRevealDemo })));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Only preload critical assets for the Hero section
  const assets = [
    // Hero Video
    { type: 'video', src: 'videos/main.webm' },
    // Navbar/Global Assets
    { type: 'image', src: '/img/logo.png' },
  ];

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {isLoading ? (
        <Preloader assets={assets} onComplete={handlePreloaderComplete} />
      ) : (
        <>
          <NavBar />
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <About />
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
          </Suspense>
          <ScrollToTop />
        </>
      )}
    </main>
  );
}

export default App;

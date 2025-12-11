import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [assetsLoaded, setAssetsLoaded] = useState({
    heroVideo: false,
    aboutImage: false,
  });

  useEffect(() => {
    // Preload hero video
    const video = document.createElement("video");
    video.src = "videos/trial.mp4";
    video.preload = "auto";
    video.onloadeddata = () => {
      setAssetsLoaded((prev) => ({ ...prev, heroVideo: true }));
    };

    // Preload about image
    const img = new Image();
    img.src = "img/mid.jpg";
    img.onload = () => {
      setAssetsLoaded((prev) => ({ ...prev, aboutImage: true }));
    };
  }, []);

  useEffect(() => {
    // Check if all assets are loaded
    if (assetsLoaded.heroVideo && assetsLoaded.aboutImage) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [assetsLoaded]);

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
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
      <ScrollToTop />
    </main>
  );
}

export default App;

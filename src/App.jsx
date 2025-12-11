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
    featureVideo: false,
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

    // Preload feature video
    const featureVideo = document.createElement("video");
    featureVideo.src = "videos/feature-2.mp4";
    featureVideo.preload = "auto";
    featureVideo.onloadeddata = () => {
      setAssetsLoaded((prev) => ({ ...prev, featureVideo: true }));
    };
  }, []);

  const totalAssets = 3;
  const loadedCount = Object.values(assetsLoaded).filter(Boolean).length;
  const progress = Math.round((loadedCount / totalAssets) * 100);

  if (isLoading) {
    return <Preloader progress={progress} onComplete={() => setIsLoading(false)} />;
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

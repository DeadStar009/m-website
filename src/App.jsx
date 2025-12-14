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
  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState({
    heroVideo: false,
    aboutImage: false,
    featureVideo: false,
  });

  useEffect(() => {
    const loadAsset = (type, loadFn, timeout = 10000) => {
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          console.warn(`${type} loading timed out, continuing anyway`);
          resolve();
        }, timeout);

        loadFn(() => {
          clearTimeout(timer);
          resolve();
        });
      });
    };

    const loadAllAssets = async () => {
      const assets = [
        // Preload hero video
        loadAsset('heroVideo', (onDone) => {
          const video = document.createElement("video");
          video.src = "videos/trial.mp4";
          video.preload = "auto";
          video.onloadeddata = () => {
            setAssetsLoaded((prev) => ({ ...prev, heroVideo: true }));
            onDone();
          };
          video.onerror = onDone;
        }),
        // Preload about image
        loadAsset('aboutImage', (onDone) => {
          const img = new Image();
          img.src = "img/mid.jpg";
          img.onload = () => {
            setAssetsLoaded((prev) => ({ ...prev, aboutImage: true }));
            onDone();
          };
          img.onerror = onDone;
        }),
        // Preload feature video
        loadAsset('featureVideo', (onDone) => {
          const featureVideo = document.createElement("video");
          featureVideo.src = "videos/feature-2.mp4";
          featureVideo.preload = "auto";
          featureVideo.onloadeddata = () => {
            setAssetsLoaded((prev) => ({ ...prev, featureVideo: true }));
            onDone();
          };
          featureVideo.onerror = onDone;
        }),
      ];

      // Load assets sequentially with smooth progress updates
      for (let i = 0; i < assets.length; i++) {
        const targetProgress = Math.round(((i + 1) / assets.length) * 100);
        await assets[i];
        
        // Smooth animation to target progress
        const currentProgress = Math.round((i / assets.length) * 100);
        const step = (targetProgress - currentProgress) / 20;
        
        for (let j = 0; j < 20; j++) {
          await new Promise(resolve => setTimeout(resolve, 25));
          setProgress(prev => Math.min(targetProgress, Math.round(prev + step)));
        }
        setProgress(targetProgress);
      }
    };

    loadAllAssets();
  }, []);

  // Keep this for reference but use the progress state
  const totalAssets = 3;
  const loadedCount = Object.values(assetsLoaded).filter(Boolean).length;

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

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
// Main preloader removed; hero handles initial loading

function App() {

  // Removed global preloading; handled inside Hero

  // Render app directly; hero controls initial loading

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

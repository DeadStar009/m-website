"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "../utils";

export const StickyScroll = ({
  content,
  contentClassName,
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const [textColor, setTextColor] = useState("text-white");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = React.useMemo(() => [
    "#000000", // slate-900
    "#ffffff", // black
    "#ffffff", // neutral-900
  ], []);
  
  const linearGradients = React.useMemo(() => [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ], []);

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
    // Set text color based on background color (black or white)
    const currentBgColor = backgroundColors[activeCard % backgroundColors.length];
    setTextColor(currentBgColor === "#000000" ? "text-white" : "text-black");
  }, [activeCard, linearGradients, backgroundColors]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex h-[30rem] justify-center space-x-20 overflow-y-auto snap-y snap-mandatory rounded-md p-5"
      ref={ref}
    >
      <div className="relative flex items-start">
        <div className="max-w-3xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20 flex min-h-[28rem] items-center snap-center">
              <div className="w-full">
                <motion.h2
                  initial={{
                    opacity: 0,
                    x: -100
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    x: activeCard === index ? 0 : -50
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`max-w-xl font-zentry text-5xl font-black uppercase leading-tight ${textColor}`}
                >
                  {item.title.split("<br />").map((line, lineIndex) => (
                    <div key={lineIndex} className="flex flex-wrap gap-2">
                      {line.split(" ").map((word, wordIndex) => (
                        <motion.span
                          key={wordIndex}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ 
                            opacity: activeCard === index ? 1 : 0.3,
                            x: activeCard === index ? 0 : -25
                          }}
                          transition={{ 
                            duration: 0.6, 
                            delay: wordIndex * 0.1,
                            ease: "easeOut" 
                          }}
                          className="special-font"
                          dangerouslySetInnerHTML={{ __html: word }}
                        />
                      ))}
                    </div>
                  ))}
                </motion.h2>
                <motion.p
                  initial={{
                    opacity: 0,
                    x: -80
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    x: activeCard === index ? 0 : -40
                  }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className={`mt-10 max-w-lg font-general opacity-80 ${textColor}`}
                >
                  {item.description}
                </motion.p>
              </div>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ 
          opacity: 1,
          x: 0,
          scale: 1
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-60 w-96 overflow-hidden rounded-md bg-white lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};
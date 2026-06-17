"use client";

import React, { useState, useEffect } from "react";
import { GeometricLogo } from "./GeometricLogo";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Database, Cpu, ChevronRight } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

const SHUFFLE_STEPS = [
  { text: "Establishing secure EMIS connection...", icon: ShieldCheck },
  { text: "Synchronizing student & staff registries...", icon: Database },
  { text: "Compiling strategic education schemas...", icon: Cpu },
  { text: "Decrypting analytics dashboard...", icon: Cpu },
  { text: "System ready for use.", icon: ShieldCheck },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Elegant timing curve for mock loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          return 100;
        }
        // Organic irregular progress jumps for visual realism & quality
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const currentStepIndex = Math.min(
    Math.floor((progress / 100) * SHUFFLE_STEPS.length),
    SHUFFLE_STEPS.length - 1
  );

  // Handle automatic or button-triggered transition
  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        onFinish();
      }, 750); // Pause on "Ready" for the user to perceive completion
      return () => clearTimeout(timer);
    }
  }, [isDone, onFinish]);

  const CurrentStepIcon = SHUFFLE_STEPS[currentStepIndex].icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden font-sans">
      {/* Background Ambience / Subtle Grid and Soft Gradient Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[24rem] h-[24rem] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Content Assembly */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Core Animated Geometric Logo */}
        <motion.div
          initial={{ scale: 0.7, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 15,
            delay: 0.1,
          }}
          className="mb-8"
        >
          <GeometricLogo size={140} onDarkBg />
        </motion.div>

        {/* Brand Text Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="space-y-2 mb-10"
        >
          <h1 className="text-3xl font-black tracking-widest text-white uppercase sm:text-4xl">
            EDU-<span className="bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">VISION</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400/80">
            Education Management Information System
          </p>
        </motion.div>

        {/* Progress System */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full space-y-4"
        >
          {/* Track Bar */}
          <div className="h-[3px] w-full bg-slate-900 border border-slate-800/50 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-[#ffd700] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          {/* Percentage & Loading captions */}
          <div className="flex items-center justify-between text-[11px] font-semibold font-mono tracking-wide px-1">
            {/* Step text with AnimatePresence for super slick text swaps */}
            <div className="text-slate-400 flex items-center gap-1.5 h-4 text-left overflow-hidden w-[80%]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStepIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center gap-1 text-slate-300 truncate"
                >
                  <CurrentStepIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {SHUFFLE_STEPS[currentStepIndex].text}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Percent complete count */}
            <span className="text-cyan-400 font-bold shrink-0">{progress}%</span>
          </div>
        </motion.div>

   
      </div>

      {/* Modern bottom status alignment */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 font-mono">
        BOTSWANA EMIS CORE v3.5.0 • ENCRYPTION ACTIVE
      </div>
    </div>
  );
};

export default SplashScreen;

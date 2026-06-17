"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LogoSplashScreenProps {
  onComplete: () => void;
  skipDuration?: number; // fallback duration to auto-complete
}

export const LogoSplashScreen: React.FC<LogoSplashScreenProps> = ({
  onComplete,
  skipDuration = 3200, // Slightly snappier total duration (3.2s)
}) => {
  const [isAssembled, setIsAssembled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Sequence stages with precise timing for visual impact
    const step1 = setTimeout(() => setCurrentStep(1), 600);  // Ring & Shield progress
    const step2 = setTimeout(() => setCurrentStep(2), 1300); // Wings & Foundation join
    const step3 = setTimeout(() => setCurrentStep(3), 2000); // Shimmer & Glow burst
    const complete = setTimeout(() => {
      setIsAssembled(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, skipDuration);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(complete);
    };
  }, [onComplete, skipDuration]);

  // Timed beautifully to stagger fast and build premium rhythmic momentum
  const brandingLetters = [
    { char: "E", delay: 1.3 },
    { char: "d", delay: 1.4 },
    { char: "u", delay: 1.5 },
    { char: "-", delay: 1.6 },
    { char: "V", delay: 1.7, highlight: true },
    { char: "I", delay: 1.8, highlight: true },
    { char: "S", delay: 1.9, highlight: true },
    { char: "I", delay: 2.0, highlight: true },
    { char: "O", delay: 2.1, highlight: true },
    { char: "N", delay: 2.2, highlight: true },
  ];

  return (
    <AnimatePresence>
      <motion.div
        id="logo-assembly-splash"
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          scale: 1.03,
          filter: "blur(6px)",
          transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
        }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000E1D] overflow-hidden select-none"
      >
        {/* Cinematic Backdrop Ambient Lighting & Mesh Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,163,163,0.18)_0%,rgba(0,10,20,1)_75%)] pointer-events-none" />
        
        {/* Subtle background tech line aesthetics */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Dynamic Rotating Auroral Glow Layer */}
        <motion.div
          animate={{
            scale: currentStep >= 3 ? [1, 1.18, 1] : 1,
            opacity: currentStep >= 2 ? [0.4, 0.7, 0.4] : 0.2,
            rotate: [0, 360],
          }}
          transition={{ 
            scale: { duration: 1.5, ease: "easeInOut" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 25, repeat: Infinity, ease: "linear" }
          }}
          className="absolute w-96 h-96 bg-gradient-to-tr from-[#00A3A3]/25 via-[#4CAD73]/12 to-[#4F46E5]/25 rounded-full blur-[72px]"
        />

        {/* Main logo assembly container - performs a kinetic micro-shiver when fully joined */}
        <motion.div
          animate={currentStep >= 3 ? {
            scale: [1, 1.04, 0.98, 1],
            rotate: [0, 0.5, -0.3, 0],
          } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_4px_20px_rgba(0,163,163,0.35)]"
          >
            <defs>
              {/* Main Bright Cyan/Teal Gradient */}
              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#00A3A3" />
              </linearGradient>

              {/* Core Green/Teal Gradient of bottom sweep */}
              <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="150%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="60%" stopColor="#05D9A4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              {/* Accent Coral/Peach-Pink Radiant of the inner ring sweep */}
              <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B8B" />
                <stop offset="100%" stopColor="#FF8A65" />
              </linearGradient>

              {/* Deep Anthracite Navy Pin Background */}
              <linearGradient id="pinBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C2638" />
                <stop offset="100%" stopColor="#0F1524" />
              </linearGradient>

              {/* Shimmer overlay */}
              <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.45)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* 1. Left Outer Sweep (Cyan Arc - sweeps counter-clockwise down the left) */}
            <motion.path
              d="M 45 9 A 41 41 0 1 0 76 83"
              stroke="url(#cyanGradient)"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            />

            {/* 2. Bottom-Right Sweep (Teal/Green Arc - curves along bottom right) */}
            <motion.path
              d="M 76 35 A 41 41 0 0 1 55 91"
              stroke="url(#tealGradient)"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />

            {/* 3. Peach/Coral Inner Sweep (Thin Inner right curve) */}
            <motion.path
              d="M 50 15 A 35 35 0 0 1 66 74"
              stroke="url(#coralGradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.95 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            />

            {/* 4. Central Pin Badge (Location pin shape - styled dark background) */}
            <motion.path
              d="M 50 22 C 34 22, 28 32, 28 48 C 28 65, 46 76, 50 78 C 54 76, 72 65, 72 48 C 72 32, 66 22, 50 22 Z"
              fill="url(#pinBgGradient)"
              stroke="#111827"
              strokeWidth="0.5"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 1.0, type: "spring", stiffness: 100, damping: 18 }}
              className="origin-center"
            />

            {/* 5. Scholastic mortarboard Diamond (Hat Top) */}
            <motion.path
              d="M 50 31 L 67 39 L 50 47 L 33 39 Z"
              stroke="url(#cyanGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut", delay: 1.0 }}
            />

            {/* 6. Orange Tassel Line (Peg coming out of top of the mortarboard diamond) */}
            <motion.line
              x1="50"
              y1="31"
              x2="50"
              y2="27"
              stroke="url(#coralGradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 1.3 }}
            />

            {/* 7. Central Magic Spark (Inside Diamond) */}
            <motion.path
              d="M 50 34 Q 50 39, 44 39 Q 50 39, 50 44 Q 50 39, 56 39 Q 50 39, 50 34 Z"
              fill="url(#coralGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8, type: "spring", stiffness: 120, damping: 15 }}
              className="origin-center"
            />

            {/* 8. White Folded Cap Support Bracket / Cap Band */}
            <motion.path
              d="M 39 48 L 39 56 L 50 66 L 61 56 L 61 48"
              stroke="#ECEFF1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeInOut", delay: 1.1 }}
            />

            {/* Radiant Shimmer Layer sweep across the face of the unified emblem */}
            {currentStep >= 3 && (
              <motion.path
                d="M 20,20 L 80,80"
                stroke="url(#shimmer)"
                strokeWidth="20"
                opacity="0.6"
                initial={{ pathLength: 0, strokeDashoffset: 50 }}
                animate={{ pathLength: 1, strokeDashoffset: -50 }}
                transition={{ duration: 1.1, ease: "linear" }}
              />
            )}
          </svg>

          {/* Magical radial flash bubble on emblem unification */}
          <AnimatePresence>
            {currentStep === 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute w-12 h-12 rounded-full border-2 border-white bg-cyan-400/40 blur-xs"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Corporate Branding / Typography Layout */}
        <div className="mt-8 text-center px-4 max-w-sm space-y-3 z-20">
          <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
            {brandingLetters.map((l, idx) => (
              <motion.span
                key={idx}
                initial={{ y: 20, opacity: 0, filter: "blur(3px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ 
                  delay: l.delay, 
                  duration: 0.5, 
                  type: "spring", 
                  stiffness: 110, 
                  damping: 15 
                }}
                className={`text-2xl sm:text-3xl font-black tracking-widest ${
                  l.highlight ? "text-[#00A3A3]" : "text-white"
                }`}
                style={{ textShadow: l.highlight ? "0 0 15px rgba(0, 163, 163, 0.45)" : "none" }}
              >
                {l.char}
              </motion.span>
            ))}
          </div>

          {/* Tagline showing Botswana EMIS and Indicators System */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-1.5"
          >
            <p className="text-[10px] sm:text-xs text-cyan-400 font-bold uppercase tracking-[0.25em] font-mono">
              Botswana Educational indicators system
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              Vital Information System for Institutional &amp; Operational Needs
            </p>
          </motion.div>
        </div>

        {/* Cinematic progress bar at the bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-slate-900/60 rounded-full overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: skipDuration / 1000, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-[#00A3A3] via-[#00E5FF] to-[#10B981] origin-left"
          />
        </div>

        {/* Fast skip action for regular users */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          whileHover={{ opacity: 0.95, scale: 1.05 }}
          onClick={onComplete}
          className="absolute bottom-16 right-8 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 hover:text-white px-3 py-1.5 bg-slate-950/40 border border-slate-800/60 rounded-lg backdrop-blur-md cursor-pointer pointer-events-auto transition-all"
        >
          Skip Intro
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

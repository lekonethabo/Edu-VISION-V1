"use client";

import React, { useId } from "react";
import { motion } from "motion/react";

interface GeometricLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | number;
  className?: string;
  animate?: boolean;
  onDarkBg?: boolean;
}

export const GeometricLogo: React.FC<GeometricLogoProps> = ({
  size = "md",
  className = "",
  animate = true,
  onDarkBg = false,
}) => {
  // Generate a completely unique identifier per component instance to avoid SVG gradient ID collisions in the DOM tree,
  // especially when some instances are hidden in responsive containers (e.g. mobile vs desktop sidebars).
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9]/g, "");

  // Determine pixel size based on preset or explicit number
  const getPixelSize = (): number => {
    if (typeof size === "number") return size;
    switch (size) {
      case "sm":
        return 24; // 1.5rem / w-6 h-6
      case "md":
        return 40; // 2.5rem / w-10 h-10
      case "lg":
        return 64; // 4rem / w-16 h-16
      case "xl":
        return 96; // 6rem / w-24 h-24
      case "2xl":
        return 128; // 8rem / w-32 h-32
      default:
        return 40;
    }
  };

  const pxSize = getPixelSize();

  // Gradient IDs scoped to this specific component instance
  const primaryGradId = `geoGradPrimary_${safeId}`;
  const accentGradId = `geoGradAccent_${safeId}`;
  const leftGradId = `geoGradLeft_${safeId}`;
  const darkGradId = `geoGradDark_${safeId}`;
  const overlayGradId = `geoGradOverlay_${safeId}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: pxSize, height: pxSize }}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={animate ? { scale: 0.85, opacity: 0 } : false}
        animate={animate ? { scale: 1, opacity: 1 } : false}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={animate ? { scale: 1.05, rotate: 3 } : undefined}
      >
        <defs>
          {/* Main Primary Gradient - Sky to Deep Ocean */}
          <linearGradient id={primaryGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={onDarkBg ? "#22d3ee" : "#00A3A3"} /> {/* Sea Cyan / Bright Cyan */}
            <stop offset="100%" stopColor={onDarkBg ? "#0284c7" : "#002652"} /> {/* Sky Blue / Prussian Deep Blue */}
          </linearGradient>

          {/* Accent Glow Gradient - Golden Sunset */}
          <linearGradient id={accentGradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={onDarkBg ? "#06b6d4" : "#00A3A3"} />
            <stop offset="50%" stopColor={onDarkBg ? "#67e8f9" : "#38bdf8"} />
            <stop offset="100%" stopColor={onDarkBg ? "#fed70a" : "#ffd700"} />
          </linearGradient>

          {/* Highlight Gradient for Left Facet */}
          <linearGradient id={leftGradId} x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={onDarkBg ? "#34d399" : "#00e5e5"} /> {/* Emerald/Cyan for contrast */}
            <stop offset="100%" stopColor={onDarkBg ? "#0891b2" : "#005d73"} />
          </linearGradient>

          {/* Shadow Gradient for Right Bottom */}
          <linearGradient id={darkGradId} x1="50%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={onDarkBg ? "#0369a1" : "#003554"} />
            <stop offset="100%" stopColor={onDarkBg ? "#075985" : "#051923"} />
          </linearGradient>

          {/* Translucent overlay */}
          <linearGradient id={overlayGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={onDarkBg ? 0.8 : 0.6} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* GEOMETRIC CONSTRUCTION & SYMBOLS */}
        {/* Underlay glow / shadow (Rotating slowly) */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          className={`${
            onDarkBg 
              ? "stroke-cyan-400/25 stroke-[1.5] fill-none" 
              : "stroke-[#00A3A3]/10 stroke-[1.5] fill-transparent"
          }`}
          animate={animate ? { rotate: 360 } : undefined}
          transition={animate ? { duration: 30, repeat: Infinity, ease: "linear" } : undefined}
          style={{ originX: "50px", originY: "50px" }}
        />

        {/* Outer Hexagonal boundary lines */}
        <motion.path
          d="M50 8L86 29V71L50 92L14 71V29L50 8Z"
          className={`${
            onDarkBg 
              ? "stroke-white/10 stroke-[0.75] fill-none" 
              : "stroke-slate-200/20 dark:stroke-slate-700/35 stroke-[0.75] fill-none"
          }`}
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* THE "PRISM OF VISION" (Geometric Open Book & Diamond structure) */}

        {/* 1. Left Wing Facet */}
        <motion.polygon
          points="50,25 18,43 18,65 50,47"
          fill={`url(#${leftGradId})`}
          stroke={onDarkBg ? "rgba(255, 255, 255, 0.25)" : "none"}
          strokeWidth={onDarkBg ? "0.75" : "0"}
          className="transition-all duration-300 hover:opacity-95 cursor-pointer"
          initial={animate ? { opacity: 0, x: -10 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />

        {/* 2. Right Wing Facet */}
        <motion.polygon
          points="50,25 50,47 82,65 82,43"
          fill={`url(#${primaryGradId})`}
          stroke={onDarkBg ? "rgba(255, 255, 255, 0.25)" : "none"}
          strokeWidth={onDarkBg ? "0.75" : "0"}
          className="transition-all duration-300 hover:opacity-95 cursor-pointer"
          initial={animate ? { opacity: 0, x: 10 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />

        {/* 3. Base Anchor Facet */}
        <motion.polygon
          points="50,54 18,72 50,90 82,72"
          fill={`url(#${darkGradId})`}
          stroke={onDarkBg ? "rgba(255, 255, 255, 0.2)" : "none"}
          strokeWidth={onDarkBg ? "0.5" : "0"}
          className="opacity-95 transition-all duration-300 hover:opacity-100"
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={animate ? { opacity: 0.95, y: 0 } : false}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        />

        {/* 4. Core Diamond Crystal / Vision Eye (Pulsating floating crystal) */}
        <motion.polygon
          points="50,15 68,36 50,57 32,36"
          fill={`url(#${accentGradId})`}
          stroke={onDarkBg ? "rgba(255, 255, 255, 0.3)" : "none"}
          strokeWidth={onDarkBg ? "0.75" : "0"}
          className="mix-blend-normal cursor-pointer"
          initial={animate ? { scale: 0.4, opacity: 0 } : false}
          animate={
            animate
              ? {
                  scale: [1, 1.04, 1],
                  opacity: [0.95, 1, 0.95],
                }
              : false
          }
          transition={
            animate
              ? {
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  default: { duration: 0.8, ease: "easeOut", delay: 0.6 },
                }
              : undefined
          }
          style={{ originX: "50px", originY: "36px" }}
        />

        {/* 5. Highlight facet on the floating Core Diamond */}
        <polygon
          points="50,15 50,57 32,36"
          fill={`url(#${overlayGradId})`}
        />

        {/* 6. Geometric Data Lines / Educational Rays */}
        <motion.line 
          x1="50" y1="8" x2="50" y2="15" 
          className={onDarkBg ? "stroke-white/20 stroke-[1.5]" : "stroke-slate-200/40 dark:stroke-slate-600/40 stroke-[1.5]"} 
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.line 
          x1="14" y1="29" x2="32" y2="36" 
          className={onDarkBg ? "stroke-white/20 stroke-[1.5]" : "stroke-slate-200/40 dark:stroke-slate-600/40 stroke-[1.5]"} 
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.line 
          x1="86" y1="29" x2="68" y2="36" 
          className={onDarkBg ? "stroke-white/20 stroke-[1.5]" : "stroke-slate-200/40 dark:stroke-slate-600/40 stroke-[1.5]"} 
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        
        {/* Core nodes */}
        <circle cx="50" cy="15" r="2.5" className="fill-[#ffd700] animate-pulse" />
        <circle cx="32" cy="36" r="1.5" className="fill-sky-400" />
        <circle cx="68" cy="36" r="1.5" className="fill-sky-400" />
        <circle cx="50" cy="57" r="2" className={onDarkBg ? "fill-cyan-400" : "fill-[#00A3A3]"} />
        <circle cx="50" cy="90" r="2.5" className={onDarkBg ? "fill-cyan-400" : "fill-[#00A3A3]"} />

      </motion.svg>
    </div>
  );
};

export default GeometricLogo;

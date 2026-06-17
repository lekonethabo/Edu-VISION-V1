"use client";

import React from "react";

interface EduVisionLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const EduVisionLogo: React.FC<EduVisionLogoProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Soft rounded ambient brand glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d8f6]/20 via-[#10b981]/15 to-[#ff6b8b]/15 rounded-full blur-md opacity-80" />
      
      {/* SVG Emblem matching the uploaded photo precisely */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-300 hover:scale-105"
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
        </defs>

        {/* 1. Left Outer Sweep (Cyan Arc - sweeps counter-clockwise down the left) */}
        <path
          d="M 45 9 A 41 41 0 1 0 76 83"
          stroke="url(#cyanGradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* 2. Bottom-Right Sweep (Teal/Green Arc - curves along bottom right) */}
        <path
          d="M 76 35 A 41 41 0 0 1 55 91"
          stroke="url(#tealGradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3. Peach/Coral Inner Sweep (Thin Inner right curve) */}
        <path
          d="M 50 15 A 35 35 0 0 1 66 74"
          stroke="url(#coralGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4. Central Pin Badge (Location pin shape - styled dark background) */}
        <path
          d="M 50 22 C 34 22, 28 32, 28 48 C 28 65, 46 76, 50 78 C 54 76, 72 65, 72 48 C 72 32, 66 22, 50 22 Z"
          fill="url(#pinBgGradient)"
          stroke="#111827"
          strokeWidth="0.5"
        />

        {/* 5. Scholastic mortarboard Diamond (Hat Top) */}
        <path
          d="M 50 31 L 67 39 L 50 47 L 33 39 Z"
          stroke="url(#cyanGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 6. Orange Tassel Line (Peg coming out of top of the mortarboard diamond) */}
        <line
          x1="50"
          y1="31"
          x2="50"
          y2="27"
          stroke="url(#coralGradient)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 7. Central Magic Spark (Inside Diamond) */}
        <path
          d="M 50 34 Q 50 39, 44 39 Q 50 39, 50 44 Q 50 39, 56 39 Q 50 39, 50 34 Z"
          fill="url(#coralGradient)"
        />

        {/* 8. White Folded Cap Support Bracket / Cap Band */}
        <path
          d="M 39 48 L 39 56 L 50 66 L 61 56 L 61 48"
          stroke="#ECEFF1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

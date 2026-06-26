"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize points
  const initPoints = (width: number, height: number) => {
    const points: Point[] = [];
    const count = Math.min(
      Math.floor((width * height) / 15000),
      80
    );
    
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
      });
    }
    return points;
  };

  // Draw function
  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    points: Point[],
    mouseX: number,
    mouseY: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    // Update points
    points.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse interaction - repel points
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      if (dist < maxDist && dist > 0) {
        const force = (maxDist - dist) / maxDist * 0.5;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }
    });

    // Draw lines between nearby points
    const maxLineDist = Math.min(width, height) / 3;
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxLineDist) {
          const opacity = 1 - (dist / maxLineDist);
          const lineWidth = opacity * 0.8;
          
          // Create gradient for line
          const gradient = ctx.createLinearGradient(
            points[i].x,
            points[i].y,
            points[j].x,
            points[j].y
          );
          
          const alpha = opacity * 0.3;
          gradient.addColorStop(0, `rgba(30, 58, 95, ${alpha * 0.5})`);
          gradient.addColorStop(0.5, `rgba(0, 169, 157, ${alpha})`);
          gradient.addColorStop(1, `rgba(30, 58, 95, ${alpha * 0.5})`);

          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }
    }

    // Draw points (pulsing effect)
    points.forEach((p, index) => {
      const pulse = Math.sin(Date.now() / 2000 + index) * 0.3 + 0.7;
      const radius = p.radius * pulse;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, radius * 3
      );
      gradient.addColorStop(0, `rgba(0, 169, 157, ${0.4 * pulse})`);
      gradient.addColorStop(0.5, `rgba(30, 58, 95, ${0.2 * pulse})`);
      gradient.addColorStop(1, `rgba(30, 58, 95, 0)`);
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core point
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 169, 157, ${0.5 * pulse})`;
      ctx.fill();
      
      // Inner highlight
      ctx.beginPath();
      ctx.arc(p.x - radius * 0.3, p.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * pulse})`;
      ctx.fill();
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    if (pointsRef.current.length === 0) {
      pointsRef.current = initPoints(width, height);
    }

    draw(
      ctx,
      width,
      height,
      pointsRef.current,
      mousePosition.x,
      mousePosition.y
    );

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      pointsRef.current = initPoints(rect.width, rect.height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
    pointsRef.current = initPoints(rect.width, rect.height);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;

'use client'

import React, { useRef, useEffect } from 'react';

const STAR_COUNT = 120;
const SHOOTING_STAR_INTERVAL = 2000; // ms
const STAR_COLOR = 'rgba(255,255,255,0.8)';
const STAR_MIN_RADIUS = 0.5;
const STAR_MAX_RADIUS = 1.5;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  flicker: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  active: boolean;
}

const Starfield: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const shootingStarRef = useRef<ShootingStar | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create stars
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: randomBetween(STAR_MIN_RADIUS, STAR_MAX_RADIUS),
      alpha: randomBetween(0.5, 1),
      flicker: randomBetween(0.002, 0.008) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // Shooting star state
    let lastShootingStar = Date.now();

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      for (const star of stars) {
        star.alpha += star.flicker;
        if (star.alpha <= 0.5 || star.alpha >= 1) star.flicker *= -1;
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = STAR_COLOR;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Shooting star
      let shootingStar = shootingStarRef.current;
      if (!shootingStar || !shootingStar.active) {
        if (Date.now() - lastShootingStar > SHOOTING_STAR_INTERVAL) {
          // Start a new shooting star
          shootingStar = {
            x: randomBetween(width * 0.2, width * 0.8),
            y: randomBetween(0, height * 0.3),
            vx: randomBetween(6, 10),
            vy: randomBetween(2, 4),
            length: randomBetween(80, 140),
            alpha: 1,
            active: true,
          };
          shootingStarRef.current = shootingStar;
          lastShootingStar = Date.now();
        }
      }
      if (shootingStar && shootingStar.active) {
        ctx.save();
        ctx.globalAlpha = shootingStar.alpha;
        ctx.strokeStyle = 'white';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length * 0.7,
          shootingStar.y - shootingStar.length * 0.2
        );
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        // Move shooting star
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.alpha -= 0.02;
        if (
          shootingStar.x > width + 50 ||
          shootingStar.y > height + 50 ||
          shootingStar.alpha <= 0
        ) {
          shootingStar.active = false;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className || ''}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default Starfield; 
"use client";

import { useEffect, useRef } from 'react';

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; size: number; opacity: number; vx: number; vy: number; twinkleSpeed: number }[] = [];
    const shootingStars: { x: number; y: number; length: number; speed: number; opacity: number; glow: number }[] = [];

    // Create twinkling and drifting stars
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005
      });
    }

    let lastShootingStarTime = Date.now();

    function createShootingStar() {
      const now = Date.now();
      if (shootingStars.length >= 2 || now - lastShootingStarTime < 120000) return;
      
      lastShootingStarTime = now;
      shootingStars.push({
        x: Math.random() * canvas.width * 0.3,
        y: Math.random() * canvas.height * 0.2,
        length: Math.random() * 100 + 80,
        speed: Math.random() * 1.5 + 2.5,
        opacity: 1,
        glow: Math.random() * 20 + 30
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Try to create shooting star on each frame (throttled internally)
      createShootingStar();

      // Draw drifting and twinkling stars
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 0.9 || star.opacity < 0.2) star.twinkleSpeed *= -1;

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw shooting stars with cinematic quality
      shootingStars.forEach((star, index) => {
        // Smooth acceleration
        star.speed *= 1.008;
        star.x += star.speed * 0.8;
        star.y += star.speed;
        star.opacity -= 0.006;
        star.glow -= 0.3;

        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
          return;
        }

        // Atmospheric glow
        ctx.shadowBlur = star.glow;
        ctx.shadowColor = `rgba(200, 220, 255, ${star.opacity * 0.6})`;

        // Main trail with gradient
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.length * 0.8, star.y - star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.3, `rgba(200, 220, 255, ${star.opacity * 0.7})`);
        gradient.addColorStop(1, 'rgba(150, 180, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length * 0.8, star.y - star.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Core bright point
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" style={{ filter: 'blur(0.3px)' }} />;
}
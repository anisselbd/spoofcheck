"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Purely decorative background. Skip the continuous rAF animation when
    // the user prefers reduced motion or on small screens — saves CPU and
    // battery and improves mobile INP/TBT (the canvas stays transparent).
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    if (reduceMotion || isSmallScreen) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const chars = "01アイウエオカキクケコSPFDKIMDMARCMTASTS{}[]<>/\\|=+-*&@#";
    const fontSize = 14;
    let columns: number;
    let drops: number[];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      columns = Math.floor(canvas!.width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.random() * -canvas!.height / fontSize
      );
    }

    function draw() {
      ctx!.fillStyle = "rgba(9, 9, 11, 0.04)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.fillStyle = "rgba(52, 211, 153, 0.06)";
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx!.fillText(char, x, y);

        if (y > canvas!.height && Math.random() > 0.995) {
          drops[i] = 0;
        }
        drops[i] += 0.1;
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

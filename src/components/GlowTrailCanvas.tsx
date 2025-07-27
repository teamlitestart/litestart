import React, { useRef, useEffect } from 'react';

const COLORS = [
  'rgba(0,255,255,0.08)', // cyan - very subtle
  'rgba(64,156,255,0.08)', // blue - very subtle
  'rgba(128,0,255,0.08)', // purple - very subtle
];

const ORB_COUNT = 1; // Just one orb
const SPRING = 0.12;
const FRICTION = 0.88;
const MOVEMENT_THRESHOLD = 2; // Minimum movement to show effect

const GlowTrailCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const orbs = useRef<{ x: number; y: number; vx: number; vy: number; color: string; }[]>([]);
  const isMoving = useRef(false);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    
    // Initialize orbs
    orbs.current = Array.from({ length: ORB_COUNT }, (_, i) => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      color: COLORS[i % COLORS.length],
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only show effect if mouse is moving enough
      isMoving.current = distance > MOVEMENT_THRESHOLD;
      
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      lastMouse.current.x = e.clientX;
      lastMouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!running) return;
      
      // Clear with very subtle fade
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255,255,255,0.02)'; // Very light fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Only update orbs if mouse is moving
      if (isMoving.current) {
        orbs.current.forEach((orb) => {
          const dx = mouse.current.x - orb.x;
          const dy = mouse.current.y - orb.y;
          
          orb.vx += dx * SPRING;
          orb.vy += dy * SPRING;
          orb.vx *= FRICTION;
          orb.vy *= FRICTION;
          
          orb.x += orb.vx;
          orb.y += orb.vy;
        });

        // Draw orbs with very subtle additive blending
        ctx.globalCompositeOperation = 'lighter';
        
        orbs.current.forEach((orb) => {
          // Draw smaller, more subtle orbs
          const sizes = [40, 25, 15]; // Much smaller sizes
          sizes.forEach((size, i) => {
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
            ctx.fillStyle = orb.color.replace('0.08', (0.04 - i * 0.01).toString());
            ctx.shadowColor = orb.color;
            ctx.shadowBlur = size * 0.3; // Much less blur
            ctx.fill();
          });
        });
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    }
    draw();
    
    return () => {
      running = false;
      window.removeEventListener('resize', resize);
    };
  }, []);

  if (window.innerWidth < 768) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
};

export default GlowTrailCanvas; 
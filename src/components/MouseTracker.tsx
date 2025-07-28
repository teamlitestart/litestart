import React, { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositions = useRef<MousePosition[]>([]);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show on mobile devices
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mousePositions.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Keep only recent positions (last 500ms)
      const now = Date.now();
      mousePositions.current = mousePositions.current.filter(
        pos => now - pos.timestamp < 500
      );
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      mousePositions.current = [];
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const positions = mousePositions.current;
      if (positions.length < 2) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();

      // Create gradient trail
      for (let i = 1; i < positions.length; i++) {
        const current = positions[i];
        const previous = positions[i - 1];
        
        // Calculate age and opacity
        const age = now - current.timestamp;
        const maxAge = 500;
        const opacity = Math.max(0, 1 - age / maxAge);
        
        if (opacity <= 0) continue;

        // Create gradient for this segment
        const gradient = ctx.createLinearGradient(
          previous.x, previous.y,
          current.x, current.y
        );

        // Gradient colors - blue to purple to pink
        const hue1 = (220 + (age / maxAge) * 60) % 360; // Blue to purple
        const hue2 = (260 + (age / maxAge) * 60) % 360; // Purple to pink
        
        gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${opacity * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${(hue1 + hue2) / 2}, 80%, 65%, ${opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${hue2}, 90%, 70%, ${opacity * 0.4})`);

        // Draw the trail segment
        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(current.x, current.y);
        
        // Line width decreases with age
        ctx.lineWidth = Math.max(1, 8 * opacity);
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = `hsla(${hue2}, 80%, 70%, ${opacity * 0.5})`;
        ctx.shadowBlur = 15 * opacity;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw current mouse position with a glowing dot
      if (positions.length > 0) {
        const current = positions[positions.length - 1];
        const age = now - current.timestamp;
        
        if (age < 100) { // Only show if very recent
          // Outer glow
          const glowGradient = ctx.createRadialGradient(
            current.x, current.y, 0,
            current.x, current.y, 20
          );
          glowGradient.addColorStop(0, 'hsla(260, 80%, 70%, 0.8)');
          glowGradient.addColorStop(0.5, 'hsla(280, 90%, 75%, 0.4)');
          glowGradient.addColorStop(1, 'hsla(300, 100%, 80%, 0)');
          
          ctx.beginPath();
          ctx.arc(current.x, current.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Inner dot
          const dotGradient = ctx.createRadialGradient(
            current.x, current.y, 0,
            current.x, current.y, 6
          );
          dotGradient.addColorStop(0, 'hsla(260, 100%, 90%, 1)');
          dotGradient.addColorStop(1, 'hsla(280, 80%, 70%, 0.8)');
          
          ctx.beginPath();
          ctx.arc(current.x, current.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = dotGradient;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default MouseTracker;
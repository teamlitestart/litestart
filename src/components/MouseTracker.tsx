import React, { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
}

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositions = useRef<MousePosition[]>([]);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());

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
      
      // Calculate velocity for intensity
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      mousePositions.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        velocity: Math.min(velocity, 50) // Higher cap for more dynamic range
      });

      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();

      // Keep only recent positions (last 400ms for feint effect)
      const now = Date.now();
      mousePositions.current = mousePositions.current.filter(
        pos => now - pos.timestamp < 400
      );
    };

    const handleMouseLeave = () => {
      // Don't immediately hide, let it fade naturally
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas completely for feint effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const positions = mousePositions.current;
      const now = Date.now();
      
      // Check if mouse has stopped moving
      const timeSinceLastMove = now - lastMoveTime.current;
      if (timeSinceLastMove > 150) {
        // Mouse stopped, start fading out
        mousePositions.current = mousePositions.current.filter(
          pos => now - pos.timestamp < 250 // Slightly longer fade when stopped
        );
        
        if (mousePositions.current.length === 0) {
          setIsVisible(false);
        }
      }

      if (positions.length < 1) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Draw feint gradient trail
      for (let i = 0; i < positions.length; i++) {
        const current = positions[i];
        const age = now - current.timestamp;
        const maxAge = 400;
        const normalizedAge = age / maxAge;
        const intensity = Math.max(0, 1 - normalizedAge);
        
        if (intensity <= 0) continue;

        // Velocity-based size and opacity
        const velocityFactor = Math.min(current.velocity / 20, 1);
        const baseSize = 120 + (velocityFactor * 180); // 120px to 300px based on speed
        const size = baseSize * intensity;
        
        // Even more subtle, feint colors
        const baseOpacity = 0.015 + (velocityFactor * 0.035); // 0.015 to 0.05 opacity
        const opacity = baseOpacity * intensity;

        // Create very subtle gradient with larger area
        const gradient = ctx.createRadialGradient(
          current.x, current.y, 0,
          current.x, current.y, size
        );
        
        // Very feint purple/magenta gradient with wider spread
        gradient.addColorStop(0, `rgba(147, 51, 234, ${opacity * 2})`); // Purple center
        gradient.addColorStop(0.2, `rgba(99, 102, 241, ${opacity * 1.2})`); // Blue-purple
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 0.8})`); // Blue
        gradient.addColorStop(0.8, `rgba(147, 197, 253, ${opacity * 0.3})`); // Light blue
        gradient.addColorStop(1, `rgba(147, 197, 253, 0)`); // Transparent edge

        ctx.beginPath();
        ctx.arc(current.x, current.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
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
    />
  );
};

export default MouseTracker;
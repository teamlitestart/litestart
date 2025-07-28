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
      
      // Calculate velocity for fire intensity
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      mousePositions.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        velocity: Math.min(velocity, 50) // Cap velocity for consistent effect
      });

      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Keep only recent positions (last 800ms for longer fire trail)
      const now = Date.now();
      mousePositions.current = mousePositions.current.filter(
        pos => now - pos.timestamp < 800
      );
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      mousePositions.current = [];
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with slight fade for fire effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const positions = mousePositions.current;
      if (positions.length < 2) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      ctx.globalCompositeOperation = 'lighter'; // Additive blending for fire effect

      // Draw fire particles/flames
      for (let i = 1; i < positions.length; i++) {
        const current = positions[i];
        const previous = positions[i - 1];
        
        // Calculate age and intensity
        const age = now - current.timestamp;
        const maxAge = 800;
        const normalizedAge = age / maxAge;
        const intensity = Math.max(0, 1 - normalizedAge);
        
        if (intensity <= 0) continue;

        // Fire color progression: white -> yellow -> orange -> red -> dark red
        let r, g, b;
        if (normalizedAge < 0.2) {
          // White to yellow
          const t = normalizedAge / 0.2;
          r = 255;
          g = 255;
          b = Math.floor(255 * (1 - t * 0.5));
        } else if (normalizedAge < 0.4) {
          // Yellow to orange
          const t = (normalizedAge - 0.2) / 0.2;
          r = 255;
          g = Math.floor(255 * (1 - t * 0.3));
          b = Math.floor(128 * (1 - t));
        } else if (normalizedAge < 0.7) {
          // Orange to red
          const t = (normalizedAge - 0.4) / 0.3;
          r = 255;
          g = Math.floor(179 * (1 - t));
          b = 0;
        } else {
          // Red to dark red
          const t = (normalizedAge - 0.7) / 0.3;
          r = Math.floor(255 * (1 - t * 0.6));
          g = 0;
          b = 0;
        }

        // Add velocity-based color variation for more dynamic fire
        const velocityFactor = Math.min(current.velocity / 20, 1);
        r = Math.min(255, r + velocityFactor * 50);
        g = Math.min(255, g + velocityFactor * 30);

        const alpha = intensity * 0.8;

        // Create multiple flame particles with random offsets
        const numParticles = Math.floor(3 + current.velocity / 10);
        
        for (let p = 0; p < numParticles; p++) {
          // Random offset for flame flicker effect
          const offsetX = (Math.random() - 0.5) * 20 * intensity;
          const offsetY = (Math.random() - 0.5) * 20 * intensity - age * 0.02; // Slight upward drift
          
          const particleX = current.x + offsetX;
          const particleY = current.y + offsetY;
          
          // Flame size based on intensity and velocity
          const baseSize = 8 + current.velocity * 0.3;
          const size = baseSize * intensity * (0.5 + Math.random() * 0.5);
          
          // Create radial gradient for each flame particle
          const gradient = ctx.createRadialGradient(
            particleX, particleY, 0,
            particleX, particleY, size
          );
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          gradient.addColorStop(0.4, `rgba(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.3)}, ${alpha * 0.7})`);
          gradient.addColorStop(1, `rgba(${Math.floor(r * 0.3)}, 0, 0, 0)`);

          ctx.beginPath();
          ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw connecting flame trail
        if (i > 0) {
          const trailGradient = ctx.createLinearGradient(
            previous.x, previous.y,
            current.x, current.y
          );
          
          trailGradient.addColorStop(0, `rgba(${r}, ${Math.floor(g * 0.7)}, 0, ${alpha * 0.3})`);
          trailGradient.addColorStop(1, `rgba(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.5)}, 0, ${alpha * 0.5})`);

          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(current.x, current.y);
          ctx.lineWidth = Math.max(2, intensity * 8 + current.velocity * 0.2);
          ctx.strokeStyle = trailGradient;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Draw main cursor flame
      if (positions.length > 0) {
        const current = positions[positions.length - 1];
        const age = now - current.timestamp;
        
        if (age < 100) {
          // Main cursor flame with multiple layers
          const layers = [
            { size: 25, color: [255, 255, 200, 0.9] },
            { size: 18, color: [255, 200, 100, 0.8] },
            { size: 12, color: [255, 150, 50, 0.7] },
            { size: 8, color: [255, 100, 0, 0.6] }
          ];

          layers.forEach(layer => {
            const gradient = ctx.createRadialGradient(
              current.x, current.y, 0,
              current.x, current.y, layer.size
            );
            
            gradient.addColorStop(0, `rgba(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]}, ${layer.color[3]})`);
            gradient.addColorStop(0.6, `rgba(${Math.floor(layer.color[0] * 0.8)}, ${Math.floor(layer.color[1] * 0.6)}, 0, ${layer.color[3] * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(current.x, current.y, layer.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          });
        }
      }

      ctx.globalCompositeOperation = 'source-over';
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
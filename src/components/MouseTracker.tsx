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

      // Keep only recent positions (last 600ms for gradient trail)
      const now = Date.now();
      mousePositions.current = mousePositions.current.filter(
        pos => now - pos.timestamp < 600
      );
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      mousePositions.current = [];
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with slight fade for gradient effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const positions = mousePositions.current;
      if (positions.length < 2) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      ctx.globalCompositeOperation = 'lighter'; // Additive blending for glow effect

      // Draw gradient particles
      for (let i = 1; i < positions.length; i++) {
        const current = positions[i];
        const previous = positions[i - 1];
        
        // Calculate age and intensity
        const age = now - current.timestamp;
        const maxAge = 600;
        const normalizedAge = age / maxAge;
        const intensity = Math.max(0, 1 - normalizedAge);
        
        if (intensity <= 0) continue;

        // Purple/Magenta gradient color progression
        let r, g, b;
        if (normalizedAge < 0.2) {
          // Bright white/cyan to bright magenta
          const t = normalizedAge / 0.2;
          r = Math.floor(255 * (0.8 + t * 0.2)); // 204 -> 255
          g = Math.floor(255 * (0.8 - t * 0.6)); // 204 -> 51
          b = 255; // Keep blue high
        } else if (normalizedAge < 0.4) {
          // Bright magenta to deep purple
          const t = (normalizedAge - 0.2) / 0.2;
          r = Math.floor(255 * (1 - t * 0.4)); // 255 -> 153
          g = Math.floor(51 * (1 - t * 0.6)); // 51 -> 20
          b = Math.floor(255 * (1 - t * 0.2)); // 255 -> 204
        } else if (normalizedAge < 0.7) {
          // Deep purple to dark purple
          const t = (normalizedAge - 0.4) / 0.3;
          r = Math.floor(153 * (1 - t * 0.5)); // 153 -> 76
          g = Math.floor(20 * (1 - t * 0.5)); // 20 -> 10
          b = Math.floor(204 * (1 - t * 0.3)); // 204 -> 143
        } else {
          // Dark purple to very dark purple
          const t = (normalizedAge - 0.7) / 0.3;
          r = Math.floor(76 * (1 - t * 0.7)); // 76 -> 23
          g = Math.floor(10 * (1 - t * 0.8)); // 10 -> 2
          b = Math.floor(143 * (1 - t * 0.6)); // 143 -> 57
        }

        // Add velocity-based brightness for more dynamic effect
        const velocityFactor = Math.min(current.velocity / 20, 1);
        r = Math.min(255, r + velocityFactor * 40);
        g = Math.min(255, g + velocityFactor * 20);
        b = Math.min(255, b + velocityFactor * 30);

        const alpha = intensity * 0.9;

        // Create multiple gradient particles with random offsets
        const numParticles = Math.floor(2 + current.velocity / 15);
        
        for (let p = 0; p < numParticles; p++) {
          // Random offset for organic movement
          const offsetX = (Math.random() - 0.5) * 15 * intensity;
          const offsetY = (Math.random() - 0.5) * 15 * intensity;
          
          const particleX = current.x + offsetX;
          const particleY = current.y + offsetY;
          
          // Particle size based on intensity and velocity
          const baseSize = 12 + current.velocity * 0.4;
          const size = baseSize * intensity * (0.5 + Math.random() * 0.5);
          
          // Create radial gradient for each particle
          const gradient = ctx.createRadialGradient(
            particleX, particleY, 0,
            particleX, particleY, size
          );
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.5)}, ${Math.floor(b * 0.8)}, ${alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(${Math.floor(r * 0.2)}, ${Math.floor(g * 0.1)}, ${Math.floor(b * 0.4)}, 0)`);

          ctx.beginPath();
          ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw connecting gradient trail
        if (i > 0) {
          const trailGradient = ctx.createLinearGradient(
            previous.x, previous.y,
            current.x, current.y
          );
          
          trailGradient.addColorStop(0, `rgba(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.6)}, ${b}, ${alpha * 0.4})`);
          trailGradient.addColorStop(1, `rgba(${r}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.9)}, ${alpha * 0.6})`);

          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(current.x, current.y);
          ctx.lineWidth = Math.max(3, intensity * 10 + current.velocity * 0.3);
          ctx.strokeStyle = trailGradient;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Draw main cursor glow
      if (positions.length > 0) {
        const current = positions[positions.length - 1];
        const age = now - current.timestamp;
        
        if (age < 100) {
          // Main cursor with multiple gradient layers
          const layers = [
            { size: 30, color: [255, 100, 255, 0.9] }, // Bright magenta
            { size: 22, color: [200, 50, 255, 0.8] },  // Purple-magenta
            { size: 16, color: [150, 30, 200, 0.7] },  // Deep purple
            { size: 10, color: [100, 20, 150, 0.6] }   // Dark purple
          ];

          layers.forEach(layer => {
            const gradient = ctx.createRadialGradient(
              current.x, current.y, 0,
              current.x, current.y, layer.size
            );
            
            gradient.addColorStop(0, `rgba(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]}, ${layer.color[3]})`);
            gradient.addColorStop(0.6, `rgba(${Math.floor(layer.color[0] * 0.7)}, ${Math.floor(layer.color[1] * 0.5)}, ${Math.floor(layer.color[2] * 0.8)}, ${layer.color[3] * 0.4})`);
            gradient.addColorStop(1, 'rgba(100, 20, 150, 0)');
            
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
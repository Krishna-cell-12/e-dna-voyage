import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  prevX: number;
  prevY: number;
}

export const AbyssBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          prevX: Math.random() * canvas.width,
          prevY: Math.random() * canvas.height,
        });
      }
      particlesRef.current = particles;
    };

    const drawParticle = (particle: Particle, time: number) => {
      const pulseFactor = Math.sin(time * 0.002 + particle.pulse) * 0.3 + 0.7;
      const glowSize = particle.size * pulseFactor;
      
      // Darken the path behind the moving particle to create attractive darker lines
      const savedComposite = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.lineWidth = Math.max(1.4, particle.size * 1.0);
      ctx.beginPath();
      ctx.moveTo(particle.prevX, particle.prevY);
      ctx.lineTo(particle.x, particle.y);
      ctx.stroke();
      ctx.globalCompositeOperation = savedComposite;

      // Create gradient for bioluminescent effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glowSize * 3
      );
      
      // Bioluminescent colors
      const colors = [
        'rgba(59, 190, 246, ', // Blue
        'rgba(6, 182, 212, ',  // Teal
        'rgba(147, 51, 234, ', // Purple
      ];
      
      const colorIndex = Math.floor(particle.pulse * 3) % colors.length;
      const baseColor = colors[colorIndex];
      
      gradient.addColorStop(0, `${baseColor}${particle.opacity * pulseFactor})`);
      gradient.addColorStop(0.4, `${baseColor}${particle.opacity * pulseFactor * 0.6})`);
      gradient.addColorStop(1, `${baseColor}0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core particle
      ctx.fillStyle = `${baseColor}${Math.min(particle.opacity * pulseFactor, 1)})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateParticles = (time: number) => {
      particlesRef.current.forEach(particle => {
        // track previous position for dark trail
        particle.prevX = particle.x;
        particle.prevY = particle.y;

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update pulse
        particle.pulse += 0.02;
      });
    };

    const animate = (time: number) => {
      // Stronger fade so dark trails accumulate darker but remain smooth
      ctx.fillStyle = 'rgba(11, 15, 25, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateParticles(time);
      particlesRef.current.forEach(particle => drawParticle(particle, time));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate(0);

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #111111 100%)' }}
    />
  );
};
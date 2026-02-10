import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor(delay = 0) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.targetOpacity = Math.random() * 0.5 + 0.3;
        this.opacity = 0;
        this.fadeInDelay = delay;
        this.fadeInSpeed = 0.02;
      }

      update() {
        // Fade in effect
        if (this.fadeInDelay > 0) {
          this.fadeInDelay--;
        } else if (this.opacity < this.targetOpacity) {
          this.opacity += this.fadeInSpeed;
          if (this.opacity > this.targetOpacity) {
            this.opacity = this.targetOpacity;
          }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (this.opacity > 0) {
          ctx.fillStyle = `rgba(147, 197, 253, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const particleCount = 40; // Reduced from 100 for performance
    const spawnInterval = 10; // Slower spawning
    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradually spawn particles
      if (particles.length < particleCount) {
        frameCount++;
        if (frameCount % spawnInterval === 0) {
          const delay = particles.length * 2; // Staggered fade-in
          particles.push(new Particle(delay));
        }
      }

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach((particleB) => {
          if (particleA.opacity > 0 && particleB.opacity > 0) {
            const dx = particleA.x - particleB.x;
            const dy = particleA.y - particleB.y;
            const distanceSq = dx * dx + dy * dy;
            const maxDistance = 120;

            if (distanceSq < maxDistance * maxDistance) {
              const distance = Math.sqrt(distanceSq);
              const lineOpacity = Math.min(particleA.opacity, particleB.opacity) * 0.15 * (1 - distance / maxDistance);
              ctx.strokeStyle = `rgba(147, 197, 253, ${lineOpacity})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particleA.x, particleA.y);
              ctx.lineTo(particleB.x, particleB.y);
              ctx.stroke();
            }
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 size-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ParticleBackground;

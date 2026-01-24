import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ParticlesBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      // Random starting position across the screen
      x: Math.random() * 100,
      y: Math.random() * 100,
      // Size varies - some stars closer (larger), some further (smaller)
      size: Math.random() * 2 + 0.5,
      // Speed varies based on perceived distance
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      // Opacity based on distance
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background">
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-foreground"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
          }}
          animate={{
            // Stars streak from center outward (Star Wars hyperspace feel)
            scale: [0, 1, 1.5],
            opacity: [0, star.opacity, 0],
            x: [0, (star.x - 50) * 3],
            y: [0, (star.y - 50) * 3],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Occasional brighter "streak" stars */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        return (
          <motion.div
            key={`streak-${i}`}
            className="absolute bg-foreground"
            style={{
              width: 1,
              height: Math.random() * 20 + 10,
              left: `${x}%`,
              top: `${y}%`,
              transformOrigin: 'center center',
              rotate: `${Math.atan2(y - 50, x - 50) * (180 / Math.PI) + 90}deg`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scaleY: [0.5, 1.5, 0.5],
              x: [0, (x - 50) * 4],
              y: [0, (y - 50) * 4],
            }}
            transition={{
              duration: Math.random() * 1.5 + 0.5,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

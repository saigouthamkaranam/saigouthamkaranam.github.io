import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = [
  'Software Engineer',
  'AI Engineer',
  'Full Stack Web Developer',
  'Site Reliability Engineer',
  'Frontend Engineer',
  'Backend Engineer',
];

export default function RoleAnimator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 md:h-10 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
          className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-muted-foreground absolute inset-0 flex items-center justify-center"
        >
          {roles[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RoleAnimator from '@/components/RoleAnimator';
export default function HeroChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Typography animations tied to scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.2, 0.5], [50, 0, -50]);
  return <section ref={containerRef} id="hero" className="relative min-h-[200vh]">
      {/* Sticky content container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 text-center">
          {/* Main title - massive Apple-style */}
          <motion.div style={{
          opacity: titleOpacity,
          y: titleY
        }} className="mb-8">
            {/* Role animator - above the name */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 1,
            delay: 0.5
          }} className="mb-6">
              <RoleAnimator />
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }} className="flex flex-col items-center">
              {/* Sai - small above */}
              <span className="text-sm sm:text-base md:text-lg text-muted-foreground tracking-[0.3em] uppercase mb-1 font-serif text-center">
                Sai
              </span>
              
              {/* Goutham - main name */}
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight">
                <span className="gradient-text-subtle">Goutham</span>
              </h1>
              
              {/* Karanam - small below */}
              <span className="text-sm sm:text-base md:text-lg text-muted-foreground tracking-[0.3em] uppercase mt-1 font-serif">KARANAM</span>
            </motion.div>
          </motion.div>
          
          {/* Subtitle - reveals on scroll */}
          <motion.p style={{
          opacity: subtitleOpacity,
          y: subtitleY
        }} className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-2xl mx-auto font-light tracking-tight">
            Engineering systems that scale.
            <br />
            Building automation that matters.
          </motion.p>
        </div>
        
        {/* Scroll indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 2,
        duration: 1
      }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }} className="flex flex-col items-center gap-3">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
              Scroll to explore
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>;
}
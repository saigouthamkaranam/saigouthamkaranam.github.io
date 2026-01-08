import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Reveal animations
  const labelOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.15, 0.25], [60, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.2, 0.3], [40, 0]);
  
  // Exit animations
  const contentOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  
  return (
    <section 
      ref={containerRef}
      id="about"
      className="relative min-h-[150vh]"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="w-full max-w-4xl mx-auto px-6 md:px-12"
        >
          {/* Chapter label */}
          <motion.p
            style={{ opacity: labelOpacity }}
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-8"
          >
            Philosophy
          </motion.p>
          
          {/* Main statement */}
          <motion.h2
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-12"
          >
            Engineering for{' '}
            <span className="gradient-text-subtle">
              reliability at scale.
            </span>
          </motion.h2>
          
          {/* Body text */}
          <motion.div
            style={{ opacity: bodyOpacity, y: bodyY }}
            className="max-w-2xl space-y-6"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I build backend systems, automation platforms, and AI-powered tools that teams depend on every day. My focus is on reducing toil and improving operational efficiency at scale.
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              From incident management to intelligent classification systems — I design infrastructure that's resilient, maintainable, and impactful.
            </p>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            style={{ opacity: bodyOpacity }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-16"
          >
            {[
              { value: '3+', label: 'Years' },
              { value: '10+', label: 'Systems' },
              { value: '50K+', label: 'Automated' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
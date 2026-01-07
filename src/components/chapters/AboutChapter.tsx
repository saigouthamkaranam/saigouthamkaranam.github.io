import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutChapter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  
  return (
    <section id="about" ref={ref} className="chapter relative py-32 md:py-48">
      {/* Spotlight */}
      <div className="spotlight-purple absolute top-1/3 right-0 w-[600px] h-[400px]" />
      
      <div className="chapter-content">
        <div className="max-w-4xl">
          {/* Section label */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6 }}
            className="caption text-muted-foreground mb-6"
          >
            About
          </motion.p>
          
          {/* Main statement */}
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="headline-section mb-8"
          >
            Engineering for{' '}
            <span className="gradient-text-subtle">reliability at scale.</span>
          </motion.h2>
          
          {/* Description */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-muted-foreground body-large max-w-2xl"
          >
            <p>
              I'm a software engineer focused on backend systems, automation, and AI-powered tooling. My work centers on building infrastructure that teams depend on daily.
            </p>
            <p>
              From incident management platforms to intelligent classification systems, I design solutions that reduce toil and improve operational efficiency across organizations.
            </p>
          </motion.div>
          
          {/* Key highlights */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '3+', label: 'Years Experience' },
              { value: '10+', label: 'Production Systems' },
              { value: '50K+', label: 'Tickets Automated' },
              { value: '99.9%', label: 'System Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-semibold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Gradient separator */}
      <div className="gradient-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}

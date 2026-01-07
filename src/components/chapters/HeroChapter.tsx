import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroChapter() {
  return (
    <section className="chapter relative">
      {/* Spotlight effect */}
      <div className="spotlight absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]" />
      
      <div className="chapter-content flex flex-col items-start justify-center min-h-screen py-20">
        <div className="max-w-3xl">
          {/* Caption */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="caption text-muted-foreground mb-6"
          >
            Software Engineer
          </motion.p>
          
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="headline-hero mb-8"
          >
            <span className="gradient-text-subtle">Goutham.</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="body-large text-muted-foreground max-w-xl mb-10"
          >
            Building scalable systems, automation platforms, and intelligent products that power enterprises.
          </motion.p>
          
          {/* Focus areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {['Backend Engineering', 'AI Automation', 'Cloud Infrastructure', 'System Design'].map((area, i) => (
              <span key={area} className="chip">
                {area}
              </span>
            ))}
          </motion.div>
          
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Resume
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="caption text-xs">Scroll</span>
          <ChevronDown size={16} />
        </motion.a>
      </motion.div>
    </section>
  );
}

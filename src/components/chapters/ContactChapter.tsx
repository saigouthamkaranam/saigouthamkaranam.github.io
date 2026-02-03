import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });
  
  const labelOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.15, 0.25], [60, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  
  return (
    <section 
      ref={containerRef}
      id="contact"
      className="relative min-h-screen py-32 md:py-48"
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
        {/* Chapter label */}
        <motion.p
          style={{ opacity: labelOpacity }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-8"
        >
          Contact
        </motion.p>
        
        {/* Title */}
        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-8"
        >
          Let's build{' '}
          <span className="gradient-text-subtle">something great.</span>
        </motion.h2>
        
        {/* Subtitle */}
        <motion.p
          style={{ opacity: contentOpacity }}
          className="text-lg md:text-xl text-muted-foreground mb-16 max-w-xl mx-auto"
        >
          Open to opportunities in Full Stack web development, Software engineering, SRE / platform teams, and AI automation roles.
        </motion.p>
        
        {/* Contact form - temporarily disabled */}
        {/* TODO: Re-enable when backend email functionality is set up */}
        
        {/* Resume CTA */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="mb-16"
        >
          <a
            href="https://drive.google.com/file/d/16O9ytRZDNEU_zmizNck9eTj7UEtcsGPt/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors group"
          >
            Download Resume
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
        
        {/* Social links */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="flex items-center justify-center gap-8"
        >
          <a
            href="mailto:s.goutham.karanam@gmail.com"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail size={20} />
            <span className="text-sm">Email</span>
          </a>
          <a
            href="https://github.com/saigouthamkaranam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={20} />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/saigouthamk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin size={20} />
            <span className="text-sm">LinkedIn</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
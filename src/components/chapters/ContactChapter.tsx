import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Github, Linkedin, Send, CheckCircle } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactChapter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle form submission
  };
  
  return (
    <section id="contact" ref={ref} className="chapter relative py-32 md:py-48">
      {/* Spotlight */}
      <div className="spotlight absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]" />
      
      <div className="chapter-content">
        <div className="max-w-2xl mx-auto text-center">
          {/* Section header */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6 }}
            className="caption text-muted-foreground mb-6"
          >
            Contact
          </motion.p>
          
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="headline-section mb-6"
          >
            Let's build{' '}
            <span className="gradient-text-subtle">something great.</span>
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-large text-muted-foreground mb-12"
          >
            Open to opportunities in backend engineering, platform teams, and AI automation roles.
          </motion.p>
          
          {/* Contact form */}
          <motion.form
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4 mb-12"
          >
            {submitted ? (
              <div className="premium-card p-8 text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <p className="headline-feature mb-2">Message sent!</p>
                <p className="text-muted-foreground">I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <textarea
                  placeholder="Your message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                />
                <button type="submit" className="btn-primary w-full md:w-auto">
                  <Send size={16} />
                  Send Message
                </button>
              </>
            )}
          </motion.form>
          
          {/* Social links */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6"
          >
            <a
              href="mailto:goutham@example.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={20} />
              <span className="text-sm">Email</span>
            </a>
            <a
              href="https://github.com/goutham"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={20} />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/goutham"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin size={20} />
              <span className="text-sm">LinkedIn</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Cpu, Zap, Server } from 'lucide-react';

const highlights = [
  {
    icon: Server,
    title: 'Backend Systems',
    description: 'Building robust, scalable APIs and microservices that handle millions of requests.',
  },
  {
    icon: Cpu,
    title: 'AI & Automation',
    description: 'Creating intelligent tools that automate workflows and enhance productivity.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing systems for speed, reliability, and seamless user experiences.',
  },
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, testable code that teams can build upon.',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding relative" ref={ref}>
      {/* Ambient Orb */}
      <div className="ambient-orb ambient-orb-purple w-96 h-96 top-0 right-0 opacity-10" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest mb-4 block">
            About Me
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Engineering <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm a software engineer passionate about building systems that matter. 
            With experience across backend development, cloud infrastructure, and AI-powered tools, 
            I focus on creating solutions that are not just functional, but exceptional. 
            I thrive in environments where I can tackle complex problems and deliver measurable impact.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Bot, Cpu, Workflow, Shield } from 'lucide-react';

const automationProjects = [
  {
    icon: Bot,
    title: 'Intelligent Chatbot Platform',
    description: 'Enterprise chatbot handling 50K+ conversations daily with context-aware responses and seamless human handoff.',
    metrics: '95% resolution rate',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation Engine',
    description: 'Low-code automation platform reducing manual tasks by 70% across departments with visual workflow builder.',
    metrics: '200+ workflows automated',
  },
  {
    icon: Shield,
    title: 'Reliability Engineering',
    description: 'Production monitoring and incident response system with predictive alerting and automated remediation.',
    metrics: '99.99% uptime achieved',
  },
  {
    icon: Cpu,
    title: 'ML Model Serving',
    description: 'High-performance inference platform serving 10+ ML models with automatic scaling and model versioning.',
    metrics: '<50ms latency p99',
  },
];

export default function AISection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-cyan w-96 h-96 -bottom-48 -left-48 opacity-15" />
      <div className="ambient-orb ambient-orb-purple w-80 h-80 top-0 right-0 opacity-10" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-medium uppercase tracking-widest mb-4 block">
            Specialization
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            AI & <span className="gradient-text">Automation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building intelligent systems that learn, adapt, and scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {automationProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * index }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 group cursor-default relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <project.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {project.metrics}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:gradient-text transition-all">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

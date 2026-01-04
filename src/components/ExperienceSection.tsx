import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar } from 'lucide-react';

const experiences = [
  {
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    period: '2022 - Present',
    description: 'Leading backend architecture for a platform serving 5M+ users. Designed microservices handling 100K+ requests/second with 99.99% uptime.',
    highlights: ['System Design', 'Team Leadership', 'Performance Optimization'],
  },
  {
    title: 'Software Engineer',
    company: 'StartupXYZ',
    period: '2020 - 2022',
    description: 'Built AI-powered automation tools that reduced manual processing time by 80%. Owned full product lifecycle from ideation to deployment.',
    highlights: ['AI/ML Integration', 'Full-Stack Development', 'Product Ownership'],
  },
  {
    title: 'Backend Engineer',
    company: 'DataDriven Co.',
    period: '2018 - 2020',
    description: 'Developed real-time data pipelines processing 1TB+ daily. Implemented event-driven architecture using Kafka and AWS.',
    highlights: ['Data Engineering', 'AWS', 'Event-Driven Systems'],
  },
];

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="section-padding relative" ref={ref}>
      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-purple w-80 h-80 -top-40 left-1/4 opacity-10" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest mb-4 block">
            Career
          </span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Work <span className="gradient-text-secondary">Experience</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Timeline Line */}
          <div className="timeline-line" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="relative pl-16 pb-12 last:pb-0"
            >
              {/* Timeline Dot */}
              <motion.div
                className="timeline-dot"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 * index + 0.2 }}
              />

              {/* Content Card */}
              <motion.div
                whileHover={{ x: 5 }}
                className="glass-card p-6 group"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Briefcase size={18} />
                    <span className="font-semibold">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar size={14} />
                    {exp.period}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>

                <p className="text-muted-foreground mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

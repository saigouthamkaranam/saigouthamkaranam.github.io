import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2 } from 'lucide-react';

const experiences = [
  {
    role: 'Software Engineer',
    company: 'Enterprise Tech Corp',
    period: '2022 – Present',
    description: 'Building automation platforms and reliability tooling for cloud infrastructure.',
    highlights: [
      'Designed incident management system reducing MTTR by 40%',
      'Built ML-powered ticket classification serving 50K+ requests monthly',
      'Led migration of legacy services to Kubernetes',
    ],
  },
  {
    role: 'Backend Developer',
    company: 'FinTech Startup',
    period: '2021 – 2022',
    description: 'Developed core payment processing APIs and fraud detection systems.',
    highlights: [
      'Built real-time payment gateway processing $2M+ daily',
      'Implemented fraud detection reducing chargebacks by 35%',
      'Optimized database queries improving response time by 60%',
    ],
  },
  {
    role: 'Software Engineering Intern',
    company: 'Cloud Solutions Inc',
    period: '2020 – 2021',
    description: 'Contributed to developer tools and internal automation systems.',
    highlights: [
      'Developed CI/CD pipeline templates used by 20+ teams',
      'Built monitoring dashboards for infrastructure health',
      'Automated deployment workflows saving 10+ hours weekly',
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ExperienceChapter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  
  return (
    <section id="experience" ref={ref} className="chapter relative py-32 md:py-48">
      {/* Spotlight */}
      <div className="spotlight absolute bottom-1/4 left-0 w-[500px] h-[400px]" />
      
      <div className="chapter-content">
        {/* Section header */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6 }}
          className="caption text-muted-foreground mb-6"
        >
          Experience
        </motion.p>
        
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="headline-section mb-16 max-w-2xl"
        >
          Delivering value{' '}
          <span className="gradient-text-subtle">at every stage.</span>
        </motion.h2>
        
        {/* Timeline */}
        <div className="max-w-3xl">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="timeline-item"
            >
              {/* Period */}
              <p className="caption text-muted-foreground mb-2">{exp.period}</p>
              
              {/* Role & Company */}
              <h3 className="headline-feature mb-1">{exp.role}</h3>
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <Building2 size={14} />
                {exp.company}
              </p>
              
              {/* Description */}
              <p className="text-muted-foreground mb-4">{exp.description}</p>
              
              {/* Highlights */}
              <ul className="space-y-2">
                {exp.highlights.map((highlight, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Gradient separator */}
      <div className="gradient-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}

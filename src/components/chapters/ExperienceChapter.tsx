import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

export default function ExperienceChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.08, 0.15], [60, 0]);
  
  return (
    <section 
      ref={containerRef}
      id="experience"
      className="relative py-32 md:py-48"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Chapter label */}
        <motion.p
          style={{ opacity: labelOpacity }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-8"
        >
          Experience
        </motion.p>
        
        {/* Title */}
        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-20"
        >
          Delivering value{' '}
          <span className="gradient-text-subtle">at every stage.</span>
        </motion.h2>
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent" />
          
          {/* Experience items */}
          <div className="space-y-16 md:space-y-20">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-10%" }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-2 h-2 -translate-x-1/2 rounded-full bg-foreground" />
                
                {/* Period */}
                <p className="text-sm tracking-wide text-muted-foreground mb-2">
                  {exp.period}
                </p>
                
                {/* Role & Company */}
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">
                  {exp.role}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {exp.company}
                </p>
                
                {/* Description */}
                <p className="text-muted-foreground mb-4 max-w-xl">
                  {exp.description}
                </p>
                
                {/* Highlights */}
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, j) => (
                    <li 
                      key={j} 
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
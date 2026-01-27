import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const experiences = [
  {
    role: 'Software Engineer – AI & Automation',
    company: "Sam's Club",
    location: 'Bentonville, AR',
    period: 'Dec 2024 – Present',
    description: 'Building AI-driven automation platforms for incident management and reliability.',
    highlights: [
      'Built AI-driven incident triage system (Python, LangChain, OpenAI APIs), reducing manual analysis by 60% and improving MTTR by 45%',
      'Developed alerts automation bot reducing alert fatigue by 70% and improving on-call efficiency',
      'Delivered Grafana/Splunk dashboards for SLOs and recovery metrics, maintaining 99.99% availability',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'ADP (Automatic Data Processing)',
    location: '',
    period: 'Nov 2021 – Dec 2022',
    description: 'Automated data migration workflows and built ETL pipelines for enterprise clients.',
    highlights: [
      'Automated data migration workflows for 50+ enterprise clients, improving throughput by 40%',
      'Built 20+ reusable ETL modules, reducing duplicated logic by 70%',
      'Optimized SQL queries on 1M+ row datasets, improving accuracy by 35% and performance by 60%',
    ],
  },
  {
    role: 'Software Engineer – Full Stack',
    company: 'Infinite Infolab',
    location: '',
    period: 'Oct 2019 – Nov 2021',
    description: 'Built and scaled production-grade payroll and HR platform serving 5,000+ users.',
    highlights: [
      'Designed 15+ RESTful APIs using Java and Spring Boot for core business workflows',
      'Developed React/Redux frontend components, reducing page load times by 35%',
      'Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment errors by 90%',
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
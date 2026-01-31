import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useTilt } from '@/hooks/use-tilt';

const projects = [
  {
    title: 'SamsCash Issue Resolver',
    description: 'Automated resolution system for payment and refund issues in retail banking.',
    impact: ['Reduced resolution time by 70%', 'Processed 10K+ tickets monthly', 'Integrated with core banking APIs'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Slack Incident Summarizer',
    description: 'AI-powered bot that summarizes incident threads and generates postmortem drafts.',
    impact: ['Saved 5+ hours per incident', 'Auto-generated actionable summaries', 'Integrated with PagerDuty & Jira'],
    stack: ['Node.js', 'OpenAI API', 'Slack SDK', 'MongoDB'],
    github: '#',
    demo: '#',
  },
  {
    title: 'ServiceNow Ticket Categorizer',
    description: 'ML-based classification tool for routing support tickets to correct teams.',
    impact: ['95% classification accuracy', 'Reduced misrouted tickets by 60%', 'Processed 50K+ tickets'],
    stack: ['Python', 'scikit-learn', 'FastAPI', 'ServiceNow API'],
    github: '#',
  },
  {
    title: 'SentiWise',
    description: 'Real-time sentiment analysis dashboard for customer feedback streams.',
    impact: ['Analyzed 100K+ reviews', 'Real-time alerting system', 'Multi-language support'],
    stack: ['React', 'Python', 'HuggingFace', 'Kafka'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Recipe Diaries',
    description: 'Full-stack recipe sharing platform with personalized recommendations.',
    impact: ['5K+ active users', 'AI-powered suggestions', 'Mobile-first design'],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    github: '#',
    demo: '#',
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const tilt = useTilt({ maxTilt: 5, scale: 1.01 });
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-10%" }}
      className="group relative"
    >
      <div className="absolute -left-4 md:-left-16 top-0 text-8xl md:text-9xl font-bold text-muted/20 select-none">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      <div 
        ref={tilt.ref as React.RefCallback<HTMLDivElement>}
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={tilt.onMouseEnter}
        onMouseLeave={tilt.onMouseLeave}
        className="relative grid md:grid-cols-[1fr,auto] gap-8 md:gap-16 p-6 -m-6 rounded-2xl transition-shadow hover:shadow-xl hover:shadow-primary/5"
      >
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">{project.title}</h3>
          <p className="text-lg text-muted-foreground max-w-xl">{project.description}</p>
          <ul className="space-y-2">
            {project.impact.map((item, j) => (
              <li key={j} className="flex items-center gap-3 text-muted-foreground">
                <ArrowUpRight size={14} className="text-accent shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            {project.stack.map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/30 text-muted-foreground border border-border/30">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex md:flex-col gap-4 items-start md:items-end md:justify-center">
          <a href={project.github} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-colors" target="_blank" rel="noopener noreferrer">
            <Github size={16} /> Code
          </a>
          {project.demo && (
            <a href={project.demo} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} /> Demo
            </a>
          )}
        </div>
      </div>
      <div className="mt-16 md:mt-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </motion.article>
  );
}

export default function ProjectsChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.08, 0.15], [60, 0]);
  
  return (
    <section ref={containerRef} id="projects" className="relative py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.p style={{ opacity: labelOpacity }} className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-8">Work</motion.p>
        <motion.h2 style={{ opacity: titleOpacity, y: titleY }} className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-20 max-w-3xl">
          Projects that <span className="gradient-text-subtle">deliver impact.</span>
        </motion.h2>
        <div className="space-y-16 md:space-y-24">
          {projects.map((project, i) => <ProjectCard key={project.title} project={project} index={i} />)}
        </div>
      </div>
    </section>
  );
}

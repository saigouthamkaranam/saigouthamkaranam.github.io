import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'SamsCash Issue Resolver',
    description: 'Automated resolution system for payment and refund issues in retail banking.',
    impact: [
      'Reduced resolution time by 70%',
      'Processed 10K+ tickets monthly',
      'Integrated with core banking APIs',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Slack Incident Summarizer',
    description: 'AI-powered bot that summarizes incident threads and generates postmortem drafts.',
    impact: [
      'Saved 5+ hours per incident',
      'Auto-generated actionable summaries',
      'Integrated with PagerDuty & Jira',
    ],
    stack: ['Node.js', 'OpenAI API', 'Slack SDK', 'MongoDB'],
    github: '#',
    demo: '#',
  },
  {
    title: 'ServiceNow Ticket Categorizer',
    description: 'ML-based classification tool for routing support tickets to correct teams.',
    impact: [
      '95% classification accuracy',
      'Reduced misrouted tickets by 60%',
      'Processed 50K+ tickets',
    ],
    stack: ['Python', 'scikit-learn', 'FastAPI', 'ServiceNow API'],
    github: '#',
  },
  {
    title: 'SentiWise',
    description: 'Real-time sentiment analysis dashboard for customer feedback streams.',
    impact: [
      'Analyzed 100K+ reviews',
      'Real-time alerting system',
      'Multi-language support',
    ],
    stack: ['React', 'Python', 'HuggingFace', 'Kafka', 'PostgreSQL'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Recipe Diaries',
    description: 'Full-stack recipe sharing platform with personalized recommendations.',
    impact: [
      '5K+ active users',
      'AI-powered recipe suggestions',
      'Mobile-first responsive design',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    github: '#',
    demo: '#',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectsChapter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  
  return (
    <section id="projects" ref={ref} className="chapter relative py-32 md:py-48">
      {/* Spotlight */}
      <div className="spotlight-purple absolute top-1/4 right-1/4 w-[600px] h-[400px]" />
      
      <div className="chapter-content">
        {/* Section header */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6 }}
          className="caption text-muted-foreground mb-6"
        >
          Work
        </motion.p>
        
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="headline-section mb-16 max-w-2xl"
        >
          Projects that{' '}
          <span className="gradient-text-subtle">deliver impact.</span>
        </motion.h2>
        
        {/* Projects grid */}
        <div className="space-y-8">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="premium-card group"
            >
              <div className="light-sweep" />
              
              <div className="relative z-10 grid md:grid-cols-[1fr,auto] gap-6 md:gap-12">
                {/* Content */}
                <div>
                  <h3 className="headline-feature mb-3 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-xl">
                    {project.description}
                  </p>
                  
                  {/* Impact bullets */}
                  <ul className="space-y-2 mb-6">
                    {project.impact.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="chip text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Links */}
                <div className="flex md:flex-col gap-3 md:justify-center">
                  <a
                    href={project.github}
                    className="btn-secondary text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} />
                    Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="btn-primary text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      
      {/* Gradient separator */}
      <div className="gradient-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}

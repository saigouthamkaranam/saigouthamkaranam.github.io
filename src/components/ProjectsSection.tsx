import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Folder } from 'lucide-react';

const projects = [
  {
    title: 'AI Document Processor',
    description: 'Automated document classification and extraction pipeline processing 10K+ documents daily with 98% accuracy using LLMs and vector search.',
    tech: ['Python', 'FastAPI', 'OpenAI', 'PostgreSQL', 'Redis'],
    github: '#',
    demo: '#',
    featured: true,
  },
  {
    title: 'Cloud Infrastructure Platform',
    description: 'Self-service infrastructure provisioning platform reducing deployment time from days to minutes with Terraform and Kubernetes.',
    tech: ['Go', 'Terraform', 'Kubernetes', 'AWS', 'React'],
    github: '#',
    demo: '#',
    featured: true,
  },
  {
    title: 'Real-time Analytics Engine',
    description: 'Event streaming platform handling 1M+ events/sec with sub-second latency for real-time dashboards and alerting.',
    tech: ['Java', 'Kafka', 'ClickHouse', 'Grafana'],
    github: '#',
    demo: '#',
    featured: true,
  },
  {
    title: 'Microservices Orchestrator',
    description: 'Service mesh implementation with automatic circuit breaking, load balancing, and distributed tracing.',
    tech: ['Python', 'gRPC', 'Envoy', 'Jaeger'],
    github: '#',
    featured: false,
  },
  {
    title: 'ML Pipeline Framework',
    description: 'End-to-end ML training and deployment pipeline with automated model versioning and A/B testing.',
    tech: ['Python', 'MLflow', 'Kubernetes', 'Seldon'],
    github: '#',
    featured: false,
  },
  {
    title: 'Developer CLI Tool',
    description: 'Productivity CLI for developers with project scaffolding, code generation, and workflow automation.',
    tech: ['Rust', 'GitHub API', 'OpenAI'],
    github: '#',
    featured: false,
  },
];

function ProjectCard({ project, index, isInView }: { 
  project: typeof projects[0]; 
  index: number; 
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      whileHover={{ y: -8 }}
      className={`glass-card p-6 h-full flex flex-col group relative overflow-hidden ${
        project.featured ? 'md:col-span-1' : ''
      }`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Folder className="w-6 h-6 text-primary" />
        </div>
        <div className="flex gap-3">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="GitHub repository"
            >
              <Github size={20} />
            </motion.a>
          )}
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Live demo"
            >
              <ExternalLink size={20} />
            </motion.a>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors relative z-10">
        {project.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow relative z-10">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="section-padding relative" ref={ref}>
      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-cyan w-96 h-96 top-1/4 -right-48 opacity-10" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest mb-4 block">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Other Projects */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-xl font-semibold text-center mb-6 text-muted-foreground"
        >
          Other Projects
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index + 3} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const skillCategories = [
  {
    title: 'Backend',
    color: 'primary',
    skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Frontend',
    color: 'secondary',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Cloud & Infra',
    color: 'primary',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    title: 'Data & AI',
    color: 'secondary',
    skills: ['SQL', 'Pandas', 'ML Basics', 'LLM APIs', 'OpenAI', 'Vector DBs'],
  },
];

function SkillCard({ category, index, isInView }: { category: typeof skillCategories[0]; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const isPrimary = category.color === 'primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 * index }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`glass-card p-6 relative overflow-hidden group cursor-default ${
        isPrimary ? 'hover:border-primary/30' : 'hover:border-secondary/30'
      }`}
      style={{
        transform: isHovered ? 'perspective(1000px) rotateX(2deg) rotateY(-2deg)' : 'perspective(1000px)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPrimary ? 'bg-gradient-to-br from-primary/10 via-transparent to-transparent' : 'bg-gradient-to-br from-secondary/10 via-transparent to-transparent'
        }`}
      />

      <h3 className={`text-xl font-bold mb-4 ${isPrimary ? 'gradient-text' : 'gradient-text-secondary'}`}>
        {category.title}
      </h3>

      <div className="flex flex-wrap gap-2 relative z-10">
        {category.skills.map((skill, skillIndex) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15 * index + 0.05 * skillIndex }}
            whileHover={{ scale: 1.1 }}
            className={`skill-badge transition-all duration-300 ${
              isPrimary
                ? 'hover:border-primary hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)]'
                : 'hover:border-secondary hover:shadow-[0_0_15px_hsl(var(--neon-purple)/0.3)]'
            }`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="section-padding relative" ref={ref}>
      {/* Ambient Orbs */}
      <div className="ambient-orb ambient-orb-cyan w-80 h-80 -top-40 -left-40 opacity-10" />
      <div className="ambient-orb ambient-orb-purple w-64 h-64 bottom-0 right-1/4 opacity-10" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-widest mb-4 block">
            Tech Stack
          </span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Skills & <span className="gradient-text-secondary">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

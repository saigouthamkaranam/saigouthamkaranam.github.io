import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Cloud, Database, Brain } from 'lucide-react';

const skillCategories = [
  {
    icon: Code2,
    title: 'Backend',
    description: 'Building robust APIs and services',
    skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js'],
  },
  {
    icon: Cloud,
    title: 'Cloud & Infrastructure',
    description: 'Deploying and scaling systems',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
  },
  {
    icon: Database,
    title: 'Data',
    description: 'Managing and processing data',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'SQL'],
  },
  {
    icon: Brain,
    title: 'AI & Automation',
    description: 'Intelligent systems and workflows',
    skills: ['LLM APIs', 'LangChain', 'ML Basics', 'Pandas', 'Automation'],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function SkillsChapter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  
  return (
    <section id="skills" ref={ref} className="chapter relative py-32 md:py-48">
      {/* Spotlight */}
      <div className="spotlight absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[500px]" />
      
      <div className="chapter-content">
        {/* Section header */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6 }}
          className="caption text-muted-foreground mb-6"
        >
          Expertise
        </motion.p>
        
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="headline-section mb-16 max-w-2xl"
        >
          The stack behind{' '}
          <span className="gradient-text-subtle">the systems.</span>
        </motion.h2>
        
        {/* Skills grid - Apple feature tiles style */}
        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="premium-card group"
            >
              {/* Light sweep effect */}
              <div className="light-sweep" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <category.icon size={24} className="text-foreground" />
                </div>
                
                {/* Title & description */}
                <h3 className="headline-feature mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-sm bg-secondary/50 text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Gradient separator */}
      <div className="gradient-separator absolute bottom-0 left-0 right-0" />
    </section>
  );
}

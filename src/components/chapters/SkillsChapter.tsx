import { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from '@/hooks/use-in-view';
import { prefersReducedMotion } from '@/lib/motion';
import SkillsScene from '@/components/scene/microscene/SkillsScene';
const skills = [
  {
    category: 'Backend',
    items: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js'],
    description: 'Building robust APIs and microservices',
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    description: 'Deploying and scaling distributed systems',
  },
  {
    category: 'Data',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'SQL'],
    description: 'Managing data at scale',
  },
  {
    category: 'AI & ML',
    items: ['LLM APIs', 'LangChain', 'Pandas', 'scikit-learn'],
    description: 'Intelligent automation and tooling',
  },
];

export default function SkillsChapter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const reducedMotion = typeof window !== 'undefined' && prefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Animations
  const labelOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.15, 0.25], [60, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0]);
  
  return (
    <section 
      ref={containerRef}
      id="skills"
      className="relative min-h-[180vh]"
    >
      {/* Scene ref for scroll tracking */}
      <div ref={sceneRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="sticky top-0 min-h-screen flex items-center py-20">
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="w-full max-w-6xl mx-auto px-6 md:px-12"
        >
          {/* Chapter label */}
          <motion.p
            style={{ opacity: labelOpacity }}
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-8"
          >
            Expertise
          </motion.p>
          
          {/* Title */}
          <motion.h2
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-16 max-w-3xl"
          >
            The stack behind{' '}
            <span className="gradient-text-subtle">the systems.</span>
          </motion.h2>
          
          {/* Skills grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-10%" }}
                className="group"
              >
                {/* Category header */}
                <div className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                    {skill.category}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {skill.description}
                  </p>
                </div>
                
                {/* Skills list */}
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, j) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + j * 0.05, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-muted-foreground border border-border/50 hover:border-border hover:text-foreground transition-colors"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
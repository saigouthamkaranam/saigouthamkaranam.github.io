import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const education = {
  degree: 'M.S. Computer Science',
  school: 'University of North Carolina at Charlotte',
  location: 'Charlotte, NC',
  period: 'Jan 2023 – May 2024',
  highlights: [
    'Client Support Technician — supported IT infrastructure, user systems, and service desk operations.',
    'Graduate Assistant for DBMS — assisted with coursework, labs, and academic support activities.',
  ],
};

export default function EducationChapter() {
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
      id="education"
      className="relative py-32 md:py-48"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Chapter label */}
        <motion.p
          style={{ opacity: labelOpacity }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-8"
        >
          Education
        </motion.p>
        
        {/* Title */}
        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-20"
        >
          Academic{' '}
          <span className="gradient-text-subtle">foundation.</span>
        </motion.h2>
        
        {/* Education card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-10%" }}
          className="relative pl-8 md:pl-12"
        >
          {/* Icon */}
          <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-foreground" />
          </div>
          
          {/* Period */}
          <p className="text-sm tracking-wide text-muted-foreground mb-2">
            {education.period}
          </p>
          
          {/* Degree */}
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">
            {education.degree}
          </h3>
          
          {/* School & Location */}
          <p className="text-muted-foreground mb-6">
            {education.school}, {education.location}
          </p>
          
          {/* Highlights */}
          <ul className="space-y-3">
            {education.highlights.map((highlight, j) => (
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
      </div>
    </section>
  );
}

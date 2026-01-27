import { Suspense } from 'react';
import { useLenis } from '@/hooks/use-lenis';
import Navigation from '@/components/Navigation';
import ProductScene from '@/components/scene/ProductScene';
import ParticlesBackground from '@/components/ParticlesBackground';
import HeroChapter from '@/components/chapters/HeroChapter';
import AboutChapter from '@/components/chapters/AboutChapter';
import SkillsChapter from '@/components/chapters/SkillsChapter';
import ExperienceChapter from '@/components/chapters/ExperienceChapter';
import EducationChapter from '@/components/chapters/EducationChapter';
import ProjectsChapter from '@/components/chapters/ProjectsChapter';
import ContactChapter from '@/components/chapters/ContactChapter';
import FooterMinimal from '@/components/FooterMinimal';

const Index = () => {
  useLenis();

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Star Wars style particle background */}
      <ParticlesBackground />
      
      {/* Grain texture overlay */}
      <div className="grain-overlay" />
      
      {/* Main 3D Scene - premium cinematic monolith only */}
      <Suspense fallback={null}>
        <ProductScene />
      </Suspense>

      {/* Navigation */}
      <Navigation />

      {/* Chapters */}
      <div className="relative z-10">
        <HeroChapter />
        <AboutChapter />
        <SkillsChapter />
        <ExperienceChapter />
        <EducationChapter />
        <ProjectsChapter />
        <ContactChapter />
        <FooterMinimal />
      </div>
    </main>
  );
};

export default Index;

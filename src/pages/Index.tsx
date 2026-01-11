import { Suspense } from 'react';
import { useLenis } from '@/hooks/use-lenis';
import Navigation from '@/components/Navigation';
import ProductScene from '@/components/scene/ProductScene';
import AmbientScene from '@/components/scene/AmbientScene';
import HeroChapter from '@/components/chapters/HeroChapter';
import AboutChapter from '@/components/chapters/AboutChapter';
import SkillsChapter from '@/components/chapters/SkillsChapter';
import ProjectsChapter from '@/components/chapters/ProjectsChapter';
import ExperienceChapter from '@/components/chapters/ExperienceChapter';
import ContactChapter from '@/components/chapters/ContactChapter';
import FooterMinimal from '@/components/FooterMinimal';

const Index = () => {
  useLenis();

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />
      
      {/* Ambient 3D layer - persistent background */}
      <Suspense fallback={null}>
        <AmbientScene />
      </Suspense>
      
      {/* Main 3D Scene - hero object */}
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
        <ProjectsChapter />
        <ExperienceChapter />
        <ContactChapter />
        <FooterMinimal />
      </div>
    </main>
  );
};

export default Index;

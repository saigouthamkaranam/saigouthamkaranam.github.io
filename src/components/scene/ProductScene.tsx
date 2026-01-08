import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGlobalScrollProgress } from '@/hooks/use-scroll-progress';
import { prefersReducedMotion, isMobile } from '@/lib/scroll';
import CinematicMonolith from './CinematicMonolith';
import Lighting from './Lighting';
import CameraController from './CameraController';

// Fog component for depth
function Fog() {
  return <fog attach="fog" args={['#000000', 6, 18]} />;
}

// Post-processing effects
function Effects({ mobile }: { mobile: boolean }) {
  if (mobile) return null;
  
  return (
    <EffectComposer>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
      />
    </EffectComposer>
  );
}

// Main scene content
function SceneContent({ 
  scrollProgress, 
  reducedMotion, 
  mobile 
}: { 
  scrollProgress: number; 
  reducedMotion: boolean; 
  mobile: boolean;
}) {
  return (
    <>
      <CameraController scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <Lighting scrollProgress={scrollProgress} />
      <CinematicMonolith scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      
      {/* Environment for realistic reflections */}
      <Environment preset="night" />
      
      <Fog />
      
      {/* Post-processing */}
      <Effects mobile={mobile} />
    </>
  );
}

// Static fallback for reduced motion
function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Static monolith representation */}
        <div className="w-28 h-56 md:w-36 md:h-72 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black rounded-2xl shadow-2xl">
          {/* Glass overlay */}
          <div className="absolute inset-2 bg-gradient-to-b from-white/5 to-transparent rounded-xl" />
          {/* Accent light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-blue-500/60 blur-sm" />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10" />
      </div>
    </div>
  );
}

// Loading state
function LoadingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-muted border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

export default function ProductScene() {
  const scrollProgress = useGlobalScrollProgress();
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  
  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setMobile(isMobile());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    
    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);
  
  // Show static fallback for reduced motion
  if (isReducedMotion) {
    return (
      <div className="canvas-wrapper">
        <StaticFallback />
      </div>
    );
  }
  
  return (
    <div className="canvas-wrapper">
      <Suspense fallback={<LoadingState />}>
        <Canvas
          dpr={[1, mobile ? 1.5 : dpr]}
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{
            antialias: !mobile,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          shadows={!mobile}
        >
          <PerformanceMonitor
            onIncline={() => setDpr(Math.min(dpr + 0.5, 2))}
            onDecline={() => setDpr(Math.max(dpr - 0.5, 1))}
          >
            <SceneContent 
              scrollProgress={scrollProgress} 
              reducedMotion={isReducedMotion}
              mobile={mobile}
            />
          </PerformanceMonitor>
        </Canvas>
      </Suspense>
    </div>
  );
}
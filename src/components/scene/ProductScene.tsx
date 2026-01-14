import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGlobalScrollProgress } from '@/hooks/use-scroll-progress';
import { prefersReducedMotion, isMobile } from '@/lib/scroll';
import CinematicMonolith from './CinematicMonolith';
import CameraController from './CameraController';
import Lighting from './Lighting';

function Fog() {
  return <fog attach="fog" args={['#000000', 5, 20]} />;
}

function Effects({ mobile }: { mobile: boolean }) {
  if (mobile) return null;
  return (
    <EffectComposer>
      <Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.9} radius={0.8} />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}

function SceneContent({ scrollProgress, reducedMotion, mobile }: { scrollProgress: number; reducedMotion: boolean; mobile: boolean }) {
  return (
    <>
      <CameraController scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <Lighting scrollProgress={scrollProgress} />
      <CinematicMonolith scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <Environment preset="city" />
      <Fog />
      <Effects mobile={mobile} />
    </>
  );
}

function StaticFallback() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
    </div>
  );
}

export default function ProductScene() {
  const scrollProgress = useGlobalScrollProgress();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    setMobile(isMobile());
  }, []);
  
  if (reducedMotion) return <StaticFallback />;
  
  return (
    <div className="canvas-wrapper">
      <Suspense fallback={null}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: !mobile, alpha: true }}>
          <SceneContent scrollProgress={scrollProgress} reducedMotion={reducedMotion} mobile={mobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGlobalScrollProgress } from '@/hooks/use-scroll-progress';
import { prefersReducedMotion, isMobile } from '@/lib/scroll';
import { useState, useEffect, Suspense } from 'react';

// Slowly drifting particles throughout the page
function AmbientParticles({ count = 80, mobile = false }: { count?: number; mobile?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = mobile ? Math.floor(count / 2) : count;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spread particles across a wide area
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      
      // Very slow velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    
    return [pos, vel];
  }, [particleCount]);
  
  useFrame(() => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Wrap around
      if (posArray[i * 3] > 15) posArray[i * 3] = -15;
      if (posArray[i * 3] < -15) posArray[i * 3] = 15;
      if (posArray[i * 3 + 1] > 30) posArray[i * 3 + 1] = -30;
      if (posArray[i * 3 + 1] < -30) posArray[i * 3 + 1] = 30;
    }
    
    positionAttr.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#4a9eff"
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Faint holographic grid lines
function HolographicGrid({ scrollProgress }: { scrollProgress: number }) {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.PI / 2 - 0.1;
      gridRef.current.position.y = -8 + scrollProgress * 2;
      gridRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });
  
  const gridLines = useMemo(() => {
    const lines = [];
    const size = 40;
    const divisions = 20;
    const step = size / divisions;
    
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      lines.push(
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-size / 2, i * step, 0, size / 2, i * step, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e3a5f" transparent opacity={0.08} />
        </line>,
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i * step, -size / 2, 0, i * step, size / 2, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e3a5f" transparent opacity={0.08} />
        </line>
      );
    }
    return lines;
  }, []);
  
  return (
    <group ref={gridRef} position={[0, -8, -10]}>
      {gridLines}
    </group>
  );
}

// Volumetric fog/light effect
function VolumetricLight({ scrollProgress }: { scrollProgress: number }) {
  const lightRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 2;
      lightRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      const opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
      (lightRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });
  
  return (
    <mesh ref={lightRef} position={[0, 0, -12]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial 
        color="#0a1628"
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function AmbientSceneContent({ scrollProgress, mobile }: { scrollProgress: number; mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.05} />
      <AmbientParticles count={80} mobile={mobile} />
      <HolographicGrid scrollProgress={scrollProgress} />
      <VolumetricLight scrollProgress={scrollProgress} />
    </>
  );
}

export default function AmbientScene() {
  const scrollProgress = useGlobalScrollProgress();
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
    setReducedMotion(prefersReducedMotion());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (reducedMotion) return null;
  
  return (
    <div className="ambient-scene-wrapper">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'low-power',
            stencil: false,
          }}
        >
          <AmbientSceneContent scrollProgress={scrollProgress} mobile={mobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}

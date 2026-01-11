import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

interface LayerProps {
  index: number;
  total: number;
  scrollProgress: number;
  inView: boolean;
}

// Individual stack layer that separates on scroll
function StackLayer({ index, total, scrollProgress, inView }: LayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetY = useRef(0);
  const targetOpacity = useRef(0);
  
  const baseY = (index - total / 2) * 0.12;
  const color = useMemo(() => {
    const colors = ['#4a9eff', '#6366f1', '#8b5cf6', '#a78bfa'];
    return colors[index % colors.length];
  }, [index]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Calculate separation based on scroll
    const separation = inView ? scrollProgress * 0.3 : 0;
    const targetPosition = baseY + (index - total / 2) * separation;
    
    targetY.current = THREE.MathUtils.lerp(targetY.current, targetPosition, 0.08);
    targetOpacity.current = THREE.MathUtils.lerp(targetOpacity.current, inView ? 1 : 0, 0.05);
    
    meshRef.current.position.y = targetY.current;
    
    // Subtle wobble
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.02;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2 + index * 0.5) * 0.01;
    
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    material.opacity = targetOpacity.current * (0.3 + index * 0.1);
  });
  
  return (
    <mesh ref={meshRef} position={[0, baseY, 0]}>
      <boxGeometry args={[2, 0.08, 1.2]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.6}
        roughness={0.2}
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function StackLayers({ scrollProgress, inView }: { scrollProgress: number; inView: boolean }) {
  const layerCount = 6;
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = 0.2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: layerCount }).map((_, i) => (
        <StackLayer
          key={i}
          index={i}
          total={layerCount}
          scrollProgress={scrollProgress}
          inView={inView}
        />
      ))}
    </group>
  );
}

function SceneContent({ scrollProgress, inView }: { scrollProgress: number; inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={0.6} color="#4a9eff" />
      <pointLight position={[-3, -3, 2]} intensity={0.4} color="#8b5cf6" />
      <StackLayers scrollProgress={scrollProgress} inView={inView} />
    </>
  );
}

export default function SkillsScene({ 
  scrollProgress = 0, 
  inView = false 
}: { 
  scrollProgress?: number; 
  inView?: boolean;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent scrollProgress={scrollProgress} inView={inView} />
        </Canvas>
      </Suspense>
    </div>
  );
}

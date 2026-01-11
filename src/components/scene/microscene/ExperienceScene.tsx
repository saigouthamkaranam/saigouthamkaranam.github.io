import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

interface BeaconProps {
  position: [number, number, number];
  delay: number;
  color: string;
  inView: boolean;
}

// Timeline beacon light that pulses
function TimelineBeacon({ position, delay, color, inView }: BeaconProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetIntensity = useRef(0);
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    targetIntensity.current = THREE.MathUtils.lerp(
      targetIntensity.current,
      inView ? 1 : 0,
      0.05
    );
    
    const time = state.clock.elapsedTime + delay;
    const pulse = 0.8 + Math.sin(time * 2) * 0.2;
    
    meshRef.current.scale.setScalar(pulse * targetIntensity.current);
    
    // Glow effect
    const glowScale = 1 + Math.sin(time * 1.5) * 0.3;
    glowRef.current.scale.setScalar(glowScale * targetIntensity.current);
    
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
    
    const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
    glowMaterial.opacity = (0.15 + Math.sin(time * 1.5) * 0.1) * targetIntensity.current;
  });
  
  return (
    <group position={position}>
      {/* Core beacon */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Vertical timeline line
function TimelineLine({ inView }: { inView: boolean }) {
  const lineRef = useRef<THREE.Line | null>(null);
  const targetOpacity = useRef(0);
  
  useFrame(() => {
    if (!lineRef.current) return;
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.05
    );
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    if (material) material.opacity = targetOpacity.current * 0.3;
  });
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0, -1.5, 0),
    ]);
  }, []);
  
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#4a9eff', transparent: true, opacity: 0.3 }))} ref={lineRef} />
  );
}

function TimelineBeacons({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const beacons = useMemo(() => [
    { position: [0, 1, 0] as [number, number, number], delay: 0, color: '#4a9eff' },
    { position: [0, 0, 0] as [number, number, number], delay: 0.5, color: '#6366f1' },
    { position: [0, -1, 0] as [number, number, number], delay: 1, color: '#8b5cf6' },
  ], []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      <TimelineLine inView={inView} />
      {beacons.map((beacon, i) => (
        <TimelineBeacon key={i} {...beacon} inView={inView} />
      ))}
    </group>
  );
}

function SceneContent({ inView }: { inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#4a9eff" />
      <TimelineBeacons inView={inView} />
    </>
  );
}

export default function ExperienceScene({ inView = false }: { inView?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent inView={inView} />
        </Canvas>
      </Suspense>
    </div>
  );
}

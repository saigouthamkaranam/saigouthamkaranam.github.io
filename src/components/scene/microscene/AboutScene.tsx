import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

// Giant floating glass torus with inner detail
function GlassTorusSystem({ inView }: { inView: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const targetOpacity = useRef(0);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.03
    );
    
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.1;
      outerRef.current.rotation.y = t * 0.15;
      outerRef.current.position.y = Math.sin(t * 0.3) * 0.3;
      (outerRef.current.material as THREE.MeshPhysicalMaterial).opacity = targetOpacity.current * 0.6;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.15;
      innerRef.current.rotation.z = t * 0.2;
      (innerRef.current.material as THREE.MeshPhysicalMaterial).opacity = targetOpacity.current * 0.4;
    }
    
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3;
      const pulse = 1 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      (coreRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.2;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = targetOpacity.current * 0.6;
    }
  });
  
  const particlePositions = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.5 + Math.sin(i * 0.5) * 0.5;
      const height = (Math.random() - 0.5) * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);
  
  return (
    <group>
      {/* Outer glass torus */}
      <mesh ref={outerRef}>
        <torusGeometry args={[2, 0.4, 32, 100]} />
        <meshPhysicalMaterial
          color="#4a9eff"
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.6}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh ref={innerRef}>
        <torusGeometry args={[1.2, 0.15, 24, 64]} />
        <meshPhysicalMaterial
          color="#a78bfa"
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.4}
          emissive="#a78bfa"
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Glowing core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          metalness={0.8}
          roughness={0.1}
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Orbiting particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#4a9eff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Floating crystal shards
function CrystalShards({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const shards = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      ] as [number, number, number],
      rotation: Math.random() * Math.PI * 2,
      scale: 0.1 + Math.random() * 0.2,
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const shard = shards[i];
        child.rotation.x = state.clock.elapsedTime * shard.speed;
        child.rotation.z = state.clock.elapsedTime * shard.speed * 0.7;
        child.position.y = shard.position[1] + Math.sin(state.clock.elapsedTime * shard.speed + i) * 0.3;
        (child.material as THREE.MeshPhysicalMaterial).opacity = inView ? 0.7 : 0;
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {shards.map((shard, i) => (
        <mesh key={i} position={shard.position} scale={shard.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={['#4a9eff', '#8b5cf6', '#06b6d4', '#f472b6'][i % 4]}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
            emissive={['#4a9eff', '#8b5cf6', '#06b6d4', '#f472b6'][i % 4]}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ inView }: { inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#4a9eff" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#a78bfa" />
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#06b6d4" />
      <GlassTorusSystem inView={inView} />
      <CrystalShards inView={inView} />
    </>
  );
}

export default function AboutScene({ inView = false }: { inView?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent inView={inView} />
        </Canvas>
      </Suspense>
    </div>
  );
}
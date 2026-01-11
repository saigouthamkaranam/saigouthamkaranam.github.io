import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

interface OrbitalNodeProps {
  position: [number, number, number];
  speed: number;
  size: number;
  color: string;
  orbitRadius: number;
  orbitOffset: number;
}

// Individual orbital node
function OrbitalNode({ position, speed, size, color, orbitRadius, orbitOffset }: OrbitalNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime * speed + orbitOffset;
    
    meshRef.current.position.x = position[0] + Math.cos(time) * orbitRadius;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.7) * orbitRadius * 0.5;
    meshRef.current.position.z = position[2] + Math.sin(time) * orbitRadius * 0.3;
    
    // Pulsing scale
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + orbitOffset) * 0.1;
    meshRef.current.scale.setScalar(size * pulse);
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Connection lines between nodes
function ConnectionLines({ inView }: { inView: boolean }) {
  const linesRef = useRef<THREE.Group>(null);
  const targetOpacity = useRef(0);
  
  useFrame(() => {
    if (!linesRef.current) return;
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.05
    );
    
    linesRef.current.children.forEach((child) => {
      const line = child as THREE.Line;
      const material = line.material as THREE.LineBasicMaterial;
      if (material) material.opacity = targetOpacity.current * 0.15;
    });
  });
  
  const lineObjects = useMemo(() => {
    const positions = [
      [[-0.5, 0, 0], [0.5, 0.3, 0]],
      [[0.5, 0.3, 0], [0, -0.4, 0]],
      [[0, -0.4, 0], [-0.5, 0, 0]],
      [[-0.3, 0.2, 0], [0.3, -0.2, 0]],
    ];
    
    return positions.map((line) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        line.map(p => new THREE.Vector3(p[0], p[1], p[2]))
      );
      const material = new THREE.LineBasicMaterial({ 
        color: '#4a9eff', 
        transparent: true, 
        opacity: 0.15 
      });
      return new THREE.Line(geometry, material);
    });
  }, []);
  
  return (
    <group ref={linesRef}>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

// Orbital cluster
function OrbitalCluster({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetOpacity = useRef(0);
  
  const nodes = useMemo(() => [
    { position: [0, 0, 0] as [number, number, number], speed: 0.3, size: 0.12, color: '#4a9eff', orbitRadius: 0.4, orbitOffset: 0 },
    { position: [0.5, 0.3, 0] as [number, number, number], speed: 0.4, size: 0.08, color: '#6366f1', orbitRadius: 0.3, orbitOffset: 1 },
    { position: [-0.4, -0.2, 0] as [number, number, number], speed: 0.35, size: 0.1, color: '#8b5cf6', orbitRadius: 0.35, orbitOffset: 2 },
    { position: [0.2, -0.4, 0] as [number, number, number], speed: 0.45, size: 0.06, color: '#a78bfa', orbitRadius: 0.25, orbitOffset: 3 },
    { position: [-0.3, 0.3, 0] as [number, number, number], speed: 0.5, size: 0.07, color: '#c4b5fd', orbitRadius: 0.2, orbitOffset: 4 },
  ], []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.05
    );
    
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });
  
  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <OrbitalNode key={i} {...node} />
      ))}
      <ConnectionLines inView={inView} />
    </group>
  );
}

function SceneContent({ inView }: { inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={0.6} color="#4a9eff" />
      <pointLight position={[-2, -2, 1]} intensity={0.4} color="#8b5cf6" />
      <OrbitalCluster inView={inView} />
    </>
  );
}

export default function ProjectsScene({ inView = false }: { inView?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent inView={inView} />
        </Canvas>
      </Suspense>
    </div>
  );
}

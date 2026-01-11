import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

// Hexagonal tech stack visualization
function HexGrid({ inView, scrollProgress }: { inView: boolean; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const hexagons = useMemo(() => {
    const items: Array<{
      position: [number, number, number];
      scale: number;
      delay: number;
      color: string;
    }> = [];
    
    const colors = ['#4a9eff', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f472b6'];
    let index = 0;
    
    for (let ring = 0; ring < 3; ring++) {
      const count = ring === 0 ? 1 : ring * 6;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = ring * 1.2;
        items.push({
          position: [
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            ring * -0.3
          ],
          scale: 0.4 - ring * 0.08,
          delay: index * 0.1,
          color: colors[index % colors.length],
        });
        index++;
      }
    }
    return items;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    groupRef.current.position.z = inView ? 0 : -5;
  });
  
  return (
    <group ref={groupRef}>
      {hexagons.map((hex, i) => (
        <HexCell key={i} {...hex} inView={inView} scrollProgress={scrollProgress} index={i} />
      ))}
    </group>
  );
}

function HexCell({ position, scale, delay, color, inView, scrollProgress, index }: {
  position: [number, number, number];
  scale: number;
  delay: number;
  color: string;
  inView: boolean;
  scrollProgress: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Explode outward based on scroll
    const explodeAmount = scrollProgress * 0.5;
    const explodeDir = new THREE.Vector3(position[0], position[1], 0).normalize();
    
    meshRef.current.position.x = position[0] + explodeDir.x * explodeAmount * index * 0.1;
    meshRef.current.position.y = position[1] + explodeDir.y * explodeAmount * index * 0.1;
    meshRef.current.position.z = position[2] + explodeAmount * index * 0.05;
    
    meshRef.current.rotation.x = Math.sin(t * 0.5 + delay) * 0.1;
    meshRef.current.rotation.y = t * 0.2 + delay;
    
    const targetOpacity = inView ? 0.8 : 0;
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.05);
    material.emissiveIntensity = 0.2 + Math.sin(t * 2 + delay) * 0.1;
    
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
        THREE.MathUtils.lerp((glowRef.current.material as THREE.MeshBasicMaterial).opacity, inView ? 0.15 : 0, 0.05);
    }
  });
  
  // Create hexagon shape
  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    const size = 1;
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 6;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);
  
  return (
    <>
      <mesh ref={meshRef} position={position} scale={scale}>
        <extrudeGeometry args={[hexShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh ref={glowRef} position={position} scale={scale * 1.5}>
        <circleGeometry args={[1, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// Data stream particles
function DataStream({ inView }: { inView: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 6;
      const radius = 2 + (i / count) * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (i / count) * 4 - 2;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    (pointsRef.current.material as THREE.PointsMaterial).opacity = inView ? 0.6 : 0;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#4a9eff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SceneContent({ scrollProgress, inView }: { scrollProgress: number; inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#4a9eff" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#8b5cf6" />
      <HexGrid inView={inView} scrollProgress={scrollProgress} />
      <DataStream inView={inView} />
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
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent scrollProgress={scrollProgress} inView={inView} />
        </Canvas>
      </Suspense>
    </div>
  );
}
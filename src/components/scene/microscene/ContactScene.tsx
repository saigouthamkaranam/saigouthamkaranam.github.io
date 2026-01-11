import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

// Massive energy portal with multiple rings
function MegaPortal({ inView }: { inView: boolean }) {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const group3Ref = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (group1Ref.current) {
      group1Ref.current.rotation.z = t * 0.3;
      group1Ref.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshPhysicalMaterial;
          material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.6 : 0, 0.05);
          material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.15;
        }
      });
    }
    
    if (group2Ref.current) {
      group2Ref.current.rotation.z = -t * 0.2;
      group2Ref.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      group2Ref.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshPhysicalMaterial;
          material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.5 : 0, 0.05);
        }
      });
    }
    
    if (group3Ref.current) {
      group3Ref.current.rotation.z = t * 0.15;
      group3Ref.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
    
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.2;
      coreRef.current.scale.setScalar(pulse);
      const material = coreRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.4 : 0, 0.05);
    }
  });
  
  return (
    <group>
      {/* Outer ring layer */}
      <group ref={group1Ref}>
        <mesh>
          <torusGeometry args={[3, 0.08, 16, 100]} />
          <meshPhysicalMaterial
            color="#4a9eff"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
            emissive="#4a9eff"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Outer segments */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]}>
            <boxGeometry args={[0.5, 0.05, 0.05]} />
            <meshPhysicalMaterial
              color="#4a9eff"
              transparent
              opacity={0.4}
              emissive="#4a9eff"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
      
      {/* Middle ring layer */}
      <group ref={group2Ref}>
        <mesh>
          <torusGeometry args={[2.2, 0.06, 16, 80]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.5}
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Hexagonal pattern */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshPhysicalMaterial
                color="#8b5cf6"
                transparent
                opacity={0.7}
                emissive="#8b5cf6"
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Inner ring layer */}
      <group ref={group3Ref}>
        <mesh>
          <torusGeometry args={[1.4, 0.04, 16, 60]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.4}
            emissive="#06b6d4"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>
      
      {/* Glowing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Spiraling energy particles
function EnergySpiral({ inView }: { inView: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color('#4a9eff'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#06b6d4'),
    ];
    
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 8;
      const radius = 0.5 + t * 3;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      
      const color = colorPalette[i % 3];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return [pos, col];
  }, []);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.7 : 0, 0.05);
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating geometric decorations
function FloatingGeometry({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => [
    { position: [-4, 3, -2] as [number, number, number], type: 'tetrahedron', size: 0.3, color: '#4a9eff' },
    { position: [4, -2, -1] as [number, number, number], type: 'octahedron', size: 0.25, color: '#8b5cf6' },
    { position: [-3, -3, -1.5] as [number, number, number], type: 'icosahedron', size: 0.2, color: '#06b6d4' },
    { position: [3, 3, -2] as [number, number, number], type: 'dodecahedron', size: 0.22, color: '#f472b6' },
  ], []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        child.rotation.x = t * (0.2 + i * 0.1);
        child.rotation.y = t * (0.3 + i * 0.05);
        child.position.y = shapes[i].position[1] + Math.sin(t * 0.5 + i) * 0.3;
        
        const material = child.material as THREE.MeshPhysicalMaterial;
        material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.7 : 0, 0.05);
      }
    });
  });
  
  const getGeometry = (type: string, size: number) => {
    switch (type) {
      case 'tetrahedron': return <tetrahedronGeometry args={[size, 0]} />;
      case 'octahedron': return <octahedronGeometry args={[size, 0]} />;
      case 'icosahedron': return <icosahedronGeometry args={[size, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[size, 0]} />;
      default: return <octahedronGeometry args={[size, 0]} />;
    }
  };
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position}>
          {getGeometry(shape.type, shape.size)}
          <meshPhysicalMaterial
            color={shape.color}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
            emissive={shape.color}
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
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#4a9eff" />
      <pointLight position={[5, 5, 3]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-5, -5, 3]} intensity={0.4} color="#06b6d4" />
      <MegaPortal inView={inView} />
      <EnergySpiral inView={inView} />
      <FloatingGeometry inView={inView} />
    </>
  );
}

export default function ContactScene({ inView = false }: { inView?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent inView={inView} />
        </Canvas>
      </Suspense>
    </div>
  );
}
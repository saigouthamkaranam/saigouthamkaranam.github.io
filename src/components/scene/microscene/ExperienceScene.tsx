import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

// Vertical DNA-like helix timeline
function DNAHelix({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const strand1Ref = useRef<THREE.Group>(null);
  const strand2Ref = useRef<THREE.Group>(null);
  
  const helixNodes = useMemo(() => {
    const nodes: Array<{ y: number; angle: number; color: string }> = [];
    const colors = ['#4a9eff', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 20; i++) {
      nodes.push({
        y: (i - 10) * 0.4,
        angle: (i / 20) * Math.PI * 4,
        color: colors[i % colors.length],
      });
    }
    return nodes;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    groupRef.current.rotation.y = t * 0.1;
    
    if (strand1Ref.current && strand2Ref.current) {
      strand1Ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const node = helixNodes[i];
          const angle = node.angle + t * 0.3;
          child.position.x = Math.cos(angle) * 0.8;
          child.position.z = Math.sin(angle) * 0.8;
          
          const material = child.material as THREE.MeshPhysicalMaterial;
          const pulse = Math.sin(t * 2 + i * 0.3);
          material.emissiveIntensity = 0.3 + pulse * 0.2;
          material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.9 : 0, 0.05);
        }
      });
      
      strand2Ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const node = helixNodes[i];
          const angle = node.angle + t * 0.3 + Math.PI;
          child.position.x = Math.cos(angle) * 0.8;
          child.position.z = Math.sin(angle) * 0.8;
          
          const material = child.material as THREE.MeshPhysicalMaterial;
          material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.7 : 0, 0.05);
        }
      });
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* First strand */}
      <group ref={strand1Ref}>
        {helixNodes.map((node, i) => (
          <mesh key={i} position={[0, node.y, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial
              color={node.color}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.9}
              emissive={node.color}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
      
      {/* Second strand */}
      <group ref={strand2Ref}>
        {helixNodes.map((node, i) => (
          <mesh key={i} position={[0, node.y, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
      
      {/* Connecting bars */}
      <HelixConnections nodes={helixNodes} inView={inView} />
    </group>
  );
}

function HelixConnections({ nodes, inView }: { nodes: Array<{ y: number; angle: number; color: string }>; inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const node = nodes[i];
        const angle = node.angle + t * 0.3;
        
        child.position.y = node.y;
        child.rotation.y = angle;
        
        const material = child.material as THREE.MeshBasicMaterial;
        material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.3 : 0, 0.05);
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {nodes.filter((_, i) => i % 2 === 0).map((node, i) => (
        <mesh key={i} position={[0, node.y, 0]}>
          <boxGeometry args={[1.6, 0.02, 0.02]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Floating milestone markers
function MilestoneMarkers({ inView }: { inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const markers = useMemo(() => [
    { position: [2, 2, 0] as [number, number, number], size: 0.2, color: '#4a9eff', label: '2021' },
    { position: [2.5, 0, 0.5] as [number, number, number], size: 0.25, color: '#8b5cf6', label: '2022' },
    { position: [2, -2, 0] as [number, number, number], size: 0.22, color: '#06b6d4', label: '2023' },
    { position: [2.5, -4, 0.3] as [number, number, number], size: 0.18, color: '#10b981', label: '2024' },
  ], []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        child.position.x = markers[i].position[0] + Math.sin(t * 0.5 + i) * 0.2;
        child.rotation.y = t * 0.5;
        
        const pulse = 1 + Math.sin(t * 2 + i * 0.5) * 0.1;
        child.scale.setScalar(markers[i].size * pulse);
        
        const material = child.material as THREE.MeshPhysicalMaterial;
        material.opacity = THREE.MathUtils.lerp(material.opacity, inView ? 0.9 : 0, 0.05);
        material.emissiveIntensity = 0.3 + Math.sin(t * 2 + i) * 0.2;
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {markers.map((marker, i) => (
        <mesh key={i} position={marker.position}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={marker.color}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
            emissive={marker.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Energy field particles
function EnergyField({ inView }: { inView: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8;
      const radius = 0.5 + (i / count) * 2;
      const y = (i - count / 2) * 0.1;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    (pointsRef.current.material as THREE.PointsMaterial).opacity = 
      THREE.MathUtils.lerp((pointsRef.current.material as THREE.PointsMaterial).opacity, inView ? 0.5 : 0, 0.05);
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
        size={0.04}
        color="#4a9eff"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SceneContent({ inView }: { inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#4a9eff" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#06b6d4" />
      <DNAHelix inView={inView} />
      <MilestoneMarkers inView={inView} />
      <EnergyField inView={inView} />
    </>
  );
}

export default function ExperienceScene({ inView = false }: { inView?: boolean }) {
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
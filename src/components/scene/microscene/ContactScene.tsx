import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

// Energy portal ring
function EnergyPortal({ inView }: { inView: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const targetOpacity = useRef(0);
  
  useFrame((state) => {
    if (!ringRef.current || !innerRingRef.current) return;
    
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.05
    );
    
    const time = state.clock.elapsedTime;
    
    // Outer ring rotation
    ringRef.current.rotation.z = time * 0.2;
    ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    
    // Inner ring counter-rotation
    innerRingRef.current.rotation.z = -time * 0.3;
    innerRingRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    
    // Update materials
    const ringMaterial = ringRef.current.material as THREE.MeshPhysicalMaterial;
    ringMaterial.opacity = targetOpacity.current * 0.4;
    ringMaterial.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
    
    const innerMaterial = innerRingRef.current.material as THREE.MeshPhysicalMaterial;
    innerMaterial.opacity = targetOpacity.current * 0.3;
    
    // Particles
    if (particlesRef.current) {
      particlesRef.current.rotation.z = time * 0.1;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = targetOpacity.current * 0.4;
    }
  });
  
  // Portal particles
  const particlePositions = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.2 + Math.random() * 0.3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    
    return positions;
  }, []);
  
  return (
    <group>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshPhysicalMaterial
          color="#4a9eff"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.4}
          emissive="#4a9eff"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1, 0.03, 16, 48]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.3}
          emissive="#8b5cf6"
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Portal particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#4a9eff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Center glow */}
      <mesh>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function SceneContent({ inView }: { inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#4a9eff" />
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#8b5cf6" />
      <EnergyPortal inView={inView} />
    </>
  );
}

export default function ContactScene({ inView = false }: { inView?: boolean }) {
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

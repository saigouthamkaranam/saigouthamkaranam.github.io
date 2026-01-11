import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

// Floating glass ring that gently rotates
function GlassRing({ inView }: { inView: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const targetOpacity = useRef(0);
  
  useFrame((state) => {
    if (!ringRef.current) return;
    
    // Smooth opacity transition
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.05
    );
    
    // Gentle rotation
    ringRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    ringRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    
    // Subtle float
    ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    
    // Update material opacity
    const material = ringRef.current.material as THREE.MeshPhysicalMaterial;
    material.opacity = targetOpacity.current * 0.6;
  });
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1.2, 0.15, 32, 64]} />
      <meshPhysicalMaterial
        color="#4a9eff"
        metalness={0.3}
        roughness={0.1}
        transmission={0.8}
        thickness={0.5}
        transparent
        opacity={0.6}
        envMapIntensity={1}
      />
    </mesh>
  );
}

// Secondary smaller ring
function InnerRing({ inView }: { inView: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const targetOpacity = useRef(0);
  
  useFrame((state) => {
    if (!ringRef.current) return;
    
    targetOpacity.current = THREE.MathUtils.lerp(
      targetOpacity.current,
      inView ? 1 : 0,
      0.03
    );
    
    ringRef.current.rotation.x = -state.clock.elapsedTime * 0.2;
    ringRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    
    const material = ringRef.current.material as THREE.MeshPhysicalMaterial;
    material.opacity = targetOpacity.current * 0.4;
  });
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[0.7, 0.08, 24, 48]} />
      <meshPhysicalMaterial
        color="#a78bfa"
        metalness={0.5}
        roughness={0.2}
        transparent
        opacity={0.4}
        emissive="#a78bfa"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function SceneContent({ inView }: { inView: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#4a9eff" />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color="#a78bfa" />
      <GlassRing inView={inView} />
      <InnerRing inView={inView} />
    </>
  );
}

export default function AboutScene({ inView = false }: { inView?: boolean }) {
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

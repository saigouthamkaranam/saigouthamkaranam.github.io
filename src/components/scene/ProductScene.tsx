import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGlobalScrollProgress } from '@/hooks/use-scroll-progress';
import { prefersReducedMotion, isMobile, lerp, mapRange, clamp } from '@/lib/scroll';

// Main monolith object
function Monolith({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Interpolated values for smooth animation
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  const targetScale = useRef(1);
  
  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    
    const reducedMotion = prefersReducedMotion();
    
    // Define animation phases based on scroll
    // Phase 1 (0-0.2): Hero - object rotates slowly, approaches camera
    // Phase 2 (0.2-0.4): About - side profile with light sweep
    // Phase 3 (0.4-0.6): Skills - exploded view effect (scale pulsing)
    // Phase 4 (0.6-0.8): Projects - centered, subtle rotation
    // Phase 5 (0.8-1.0): Contact - fade back
    
    if (reducedMotion) {
      // Static position for reduced motion
      targetRotation.current = { x: 0, y: 0, z: 0 };
      targetPosition.current = { x: 2, y: 0, z: 0 };
      targetScale.current = 1;
    } else {
      // Hero phase
      if (scrollProgress < 0.2) {
        const phase = scrollProgress / 0.2;
        targetRotation.current.y = phase * 0.5;
        targetRotation.current.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        targetPosition.current.z = mapRange(phase, 0, 1, -2, 0);
        targetPosition.current.x = mapRange(phase, 0, 1, 0, 1);
        targetScale.current = mapRange(phase, 0, 1, 0.8, 1);
      }
      // About phase - side profile
      else if (scrollProgress < 0.4) {
        const phase = (scrollProgress - 0.2) / 0.2;
        targetRotation.current.y = 0.5 + phase * 1.2;
        targetRotation.current.x = 0.1;
        targetPosition.current.x = mapRange(phase, 0, 1, 1, 2.5);
        targetPosition.current.z = 0;
        targetScale.current = 1;
      }
      // Skills phase - feature view
      else if (scrollProgress < 0.6) {
        const phase = (scrollProgress - 0.4) / 0.2;
        targetRotation.current.y = 1.7 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        targetRotation.current.x = mapRange(phase, 0, 1, 0.1, -0.2);
        targetPosition.current.x = 2.5;
        targetPosition.current.y = mapRange(phase, 0, 1, 0, -0.5);
        targetScale.current = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      }
      // Projects phase - centered
      else if (scrollProgress < 0.8) {
        const phase = (scrollProgress - 0.6) / 0.2;
        targetRotation.current.y = 1.7 + phase * 1;
        targetRotation.current.x = mapRange(phase, 0, 1, -0.2, 0);
        targetPosition.current.x = mapRange(phase, 0, 1, 2.5, 3);
        targetPosition.current.y = mapRange(phase, 0, 1, -0.5, 0);
        targetScale.current = 1;
      }
      // Contact phase - subtle
      else {
        const phase = (scrollProgress - 0.8) / 0.2;
        targetRotation.current.y = 2.7 + phase * 0.5;
        targetPosition.current.x = 3;
        targetPosition.current.y = mapRange(phase, 0, 1, 0, 0.5);
        targetScale.current = mapRange(phase, 0, 1, 1, 0.9);
      }
    }
    
    // Smooth interpolation
    const lerpFactor = 1 - Math.pow(0.001, delta);
    
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, targetRotation.current.x, lerpFactor);
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetRotation.current.y, lerpFactor);
    groupRef.current.rotation.z = lerp(groupRef.current.rotation.z, targetRotation.current.z, lerpFactor);
    
    groupRef.current.position.x = lerp(groupRef.current.position.x, targetPosition.current.x, lerpFactor);
    groupRef.current.position.y = lerp(groupRef.current.position.y, targetPosition.current.y, lerpFactor);
    groupRef.current.position.z = lerp(groupRef.current.position.z, targetPosition.current.z, lerpFactor);
    
    const currentScale = groupRef.current.scale.x;
    const newScale = lerp(currentScale, targetScale.current, lerpFactor);
    groupRef.current.scale.setScalar(newScale);
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -2]} scale={0.8}>
      <Float
        speed={2}
        rotationIntensity={0.1}
        floatIntensity={0.3}
        floatingRange={[-0.1, 0.1]}
      >
        <mesh ref={meshRef} castShadow receiveShadow>
          {/* Futuristic monolith - rounded box */}
          <boxGeometry args={[1.2, 2.4, 0.3, 32, 32, 32]} />
          <meshPhysicalMaterial
            ref={materialRef}
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Glass overlay */}
        <mesh position={[0, 0, 0.16]} castShadow>
          <boxGeometry args={[1.1, 2.3, 0.02, 16, 16, 1]} />
          <MeshTransmissionMaterial
            transmission={0.95}
            thickness={0.5}
            roughness={0.05}
            chromaticAberration={0.03}
            ior={1.5}
            color="#ffffff"
          />
        </mesh>
        
        {/* Accent light strip */}
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[0.8, 0.02]} />
          <meshStandardMaterial
            color="#4a9eff"
            emissive="#4a9eff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Lighting setup
function Lighting() {
  return (
    <>
      {/* Key light */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Rim light */}
      <pointLight
        position={[-5, 2, -5]}
        intensity={0.5}
        color="#4a9eff"
      />
      
      {/* Fill light */}
      <pointLight
        position={[0, -3, 3]}
        intensity={0.3}
        color="#8b5cf6"
      />
      
      {/* Ambient */}
      <ambientLight intensity={0.1} />
    </>
  );
}

// Camera controller
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5));
  
  useFrame((_, delta) => {
    // Subtle camera movement based on scroll
    const newZ = mapRange(scrollProgress, 0, 1, 5, 4);
    const newY = mapRange(scrollProgress, 0, 1, 0, 0.5);
    
    targetPosition.current.set(0, newY, newZ);
    
    camera.position.lerp(targetPosition.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(2, 0, 0);
  });
  
  return null;
}

// Main scene component
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const mobile = isMobile();
  
  return (
    <>
      <CameraController scrollProgress={scrollProgress} />
      <Lighting />
      <Monolith scrollProgress={scrollProgress} />
      
      {/* Environment for realistic reflections */}
      <Environment preset="city" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 8, 20]} />
    </>
  );
}

// Canvas wrapper with scroll progress
export default function ProductScene() {
  const scrollProgress = useGlobalScrollProgress();
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setMobile(isMobile());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Show static fallback for reduced motion
  if (isReducedMotion) {
    return (
      <div className="canvas-wrapper">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-64 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="canvas-wrapper">
      <Canvas
        dpr={[1, mobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

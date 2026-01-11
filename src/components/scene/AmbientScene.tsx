import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGlobalScrollProgress } from '@/hooks/use-scroll-progress';
import { prefersReducedMotion, isMobile } from '@/lib/scroll';
import { useState, useEffect, Suspense } from 'react';

// Glowing floating orbs that drift across the screen
function FloatingOrbs({ count = 15, mobile = false }: { count?: number; mobile?: boolean }) {
  const orbCount = mobile ? Math.floor(count / 2) : count;
  const groupRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => {
    return Array.from({ length: orbCount }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 10 - 5
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.3,
      speed: 0.2 + Math.random() * 0.5,
      color: ['#4a9eff', '#8b5cf6', '#06b6d4', '#f472b6'][i % 4],
      offset: Math.random() * Math.PI * 2,
    }));
  }, [orbCount]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} index={i} />
      ))}
    </group>
  );
}

function FloatingOrb({ position, scale, speed, color, offset, index }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  offset: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * speed + offset;
    
    meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.3 + index) * 3;
    meshRef.current.position.z = position[2] + Math.sin(time * 0.4) * 1;
    
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.scale.setScalar(scale * 3 + Math.sin(time * 2) * 0.2);
    }
  });
  
  return (
    <>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// Animated particles that flow upward
function FlowingParticles({ count = 200, mobile = false }: { count?: number; mobile?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = mobile ? Math.floor(count / 3) : count;
  
  const [positions, velocities, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = 0.01 + Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      
      siz[i] = 0.02 + Math.random() * 0.04;
    }
    
    return [pos, vel, siz];
  }, [particleCount]);
  
  useFrame(() => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Wrap around
      if (posArray[i * 3 + 1] > 30) {
        posArray[i * 3 + 1] = -30;
        posArray[i * 3] = (Math.random() - 0.5) * 40;
      }
      if (posArray[i * 3] > 20) posArray[i * 3] = -20;
      if (posArray[i * 3] < -20) posArray[i * 3] = 20;
    }
    
    positionAttr.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
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
  );
}

// Rotating wireframe geometric shapes
function WireframeShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <WireframeShape 
        position={[-8, 5, -8]} 
        geometry="dodecahedron" 
        scale={2} 
        color="#4a9eff"
        rotationSpeed={0.3}
      />
      <WireframeShape 
        position={[10, -8, -6]} 
        geometry="icosahedron" 
        scale={2.5} 
        color="#8b5cf6"
        rotationSpeed={0.2}
      />
      <WireframeShape 
        position={[-6, -12, -10]} 
        geometry="octahedron" 
        scale={1.8} 
        color="#06b6d4"
        rotationSpeed={0.4}
      />
      <WireframeShape 
        position={[8, 12, -7]} 
        geometry="tetrahedron" 
        scale={1.5} 
        color="#f472b6"
        rotationSpeed={0.35}
      />
    </group>
  );
}

function WireframeShape({ position, geometry, scale, color, rotationSpeed }: {
  position: [number, number, number];
  geometry: 'dodecahedron' | 'icosahedron' | 'octahedron' | 'tetrahedron';
  scale: number;
  color: string;
  rotationSpeed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.7;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  const GeometryComponent = {
    dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
    icosahedron: <icosahedronGeometry args={[1, 0]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
    tetrahedron: <tetrahedronGeometry args={[1, 0]} />,
  }[geometry];

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {GeometryComponent}
      <meshBasicMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
}

// Holographic grid floor
function HolographicGrid({ scrollProgress }: { scrollProgress: number }) {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = -15 + scrollProgress * 5;
      gridRef.current.rotation.x = Math.PI / 2.2;
      
      // Animate grid lines
      gridRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.05;
        }
      });
    }
  });
  
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const size = 60;
    const divisions = 30;
    const step = size / divisions;
    
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      lines.push(
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-size / 2, i * step, 0, size / 2, i * step, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e40af" transparent opacity={0.15} />
        </line>,
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i * step, -size / 2, 0, i * step, size / 2, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#1e40af" transparent opacity={0.15} />
        </line>
      );
    }
    return lines;
  }, []);
  
  return (
    <group ref={gridRef} position={[0, -10, -15]}>
      {gridLines}
    </group>
  );
}

// Central rotating ring structure
function CentralRings() {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const group3Ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group1Ref.current) {
      group1Ref.current.rotation.x = t * 0.1;
      group1Ref.current.rotation.y = t * 0.15;
    }
    if (group2Ref.current) {
      group2Ref.current.rotation.x = -t * 0.08;
      group2Ref.current.rotation.z = t * 0.12;
    }
    if (group3Ref.current) {
      group3Ref.current.rotation.y = t * 0.05;
      group3Ref.current.rotation.z = -t * 0.08;
    }
  });

  return (
    <group position={[0, 0, -8]}>
      <group ref={group1Ref}>
        <mesh>
          <torusGeometry args={[4, 0.02, 16, 100]} />
          <meshBasicMaterial color="#4a9eff" transparent opacity={0.4} />
        </mesh>
      </group>
      <group ref={group2Ref}>
        <mesh>
          <torusGeometry args={[5, 0.015, 16, 100]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
        </mesh>
      </group>
      <group ref={group3Ref}>
        <mesh>
          <torusGeometry args={[6, 0.01, 16, 100]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function AmbientSceneContent({ scrollProgress, mobile }: { scrollProgress: number; mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#4a9eff" />
      <pointLight position={[-10, -10, 5]} intensity={0.2} color="#8b5cf6" />
      <pointLight position={[0, 15, -5]} intensity={0.2} color="#06b6d4" />
      
      <FloatingOrbs count={15} mobile={mobile} />
      <FlowingParticles count={200} mobile={mobile} />
      <WireframeShapes />
      <HolographicGrid scrollProgress={scrollProgress} />
      <CentralRings />
    </>
  );
}

export default function AmbientScene() {
  const scrollProgress = useGlobalScrollProgress();
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
    setReducedMotion(prefersReducedMotion());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (reducedMotion) return null;
  
  return (
    <div className="ambient-scene-wrapper">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <AmbientSceneContent scrollProgress={scrollProgress} mobile={mobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, mapRange, easeInOutCubic } from '@/lib/scroll';

interface MonolithProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

// Create morph target geometry for the bending effect
function createMorphTargets(geometry: THREE.BoxGeometry) {
  const position = geometry.attributes.position;
  const count = position.count;
  
  // Bent morph target
  const bentPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    
    const bendAmount = Math.sin((y + 2) * 0.5) * 0.3;
    bentPositions[i * 3] = x + bendAmount;
    bentPositions[i * 3 + 1] = y;
    bentPositions[i * 3 + 2] = z + Math.cos((y + 2) * 0.3) * 0.15;
  }
  
  // Twisted morph target
  const twistedPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    
    const angle = y * 0.2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    twistedPositions[i * 3] = x * cos - z * sin;
    twistedPositions[i * 3 + 1] = y;
    twistedPositions[i * 3 + 2] = x * sin + z * cos;
  }
  
  geometry.morphAttributes.position = [
    new THREE.BufferAttribute(bentPositions, 3),
    new THREE.BufferAttribute(twistedPositions, 3)
  ];
}

// Main monolith core with glass/chrome material
function MonolithCore({ scrollProgress, reducedMotion }: MonolithProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.2, 3, 0.15, 32, 64, 8);
    createMorphTargets(geo);
    return geo;
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    
    const mesh = meshRef.current;
    const time = state.clock.elapsedTime;
    
    // Morph target animation based on scroll
    if (scrollProgress > 0.35 && scrollProgress < 0.55) {
      const phase = (scrollProgress - 0.35) / 0.2;
      mesh.morphTargetInfluences![0] = lerp(
        mesh.morphTargetInfluences![0],
        easeInOutCubic(phase) * 0.6,
        1 - Math.pow(0.1, delta)
      );
      mesh.morphTargetInfluences![1] = lerp(
        mesh.morphTargetInfluences![1],
        easeInOutCubic(phase) * 0.3,
        1 - Math.pow(0.1, delta)
      );
    } else {
      mesh.morphTargetInfluences![0] = lerp(mesh.morphTargetInfluences![0], 0, 1 - Math.pow(0.05, delta));
      mesh.morphTargetInfluences![1] = lerp(mesh.morphTargetInfluences![1], 0, 1 - Math.pow(0.05, delta));
    }
    
    // Material breathing effect
    if (materialRef.current) {
      const breathe = Math.sin(time * 0.5) * 0.02 + 0.98;
      materialRef.current.metalness = 0.95 * breathe;
      materialRef.current.clearcoat = 0.8 + Math.sin(time * 0.3) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        ref={materialRef}
        color="#1a1a2e"
        metalness={0.95}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
        envMapIntensity={1.5}
        transparent
        opacity={0.98}
      />
    </mesh>
  );
}

// Glass layers that separate during skills chapter
function GlassLayer({ index, scrollProgress, reducedMotion }: { 
  index: number; 
  scrollProgress: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseOffset = (index - 2) * 0.08;
  
  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    
    let targetZ = baseOffset;
    let targetOpacity = 0.15;
    
    if (scrollProgress > 0.55 && scrollProgress < 0.75) {
      const phase = (scrollProgress - 0.55) / 0.2;
      const separation = easeInOutCubic(phase);
      targetZ = baseOffset + (index - 2) * separation * 0.4;
      targetOpacity = 0.08 + separation * 0.12;
    }
    
    meshRef.current.position.z = lerp(meshRef.current.position.z, targetZ, 1 - Math.pow(0.1, delta));
    
    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    material.opacity = lerp(material.opacity, targetOpacity, 1 - Math.pow(0.1, delta));
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, baseOffset]}>
      <boxGeometry args={[1.15, 2.9, 0.02]} />
      <meshPhysicalMaterial
        color="#2a2a4e"
        metalness={0.3}
        roughness={0.1}
        transmission={0.9}
        thickness={0.5}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Light accent strip
function AccentLight({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    const baseIntensity = 1.5;
    const pulseIntensity = Math.sin(time * 2) * 0.3;
    const scrollBoost = scrollProgress > 0.5 ? 0.5 : 0;
    
    materialRef.current.emissiveIntensity = baseIntensity + pulseIntensity + scrollBoost;
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0.14]}>
      <planeGeometry args={[0.9, 0.015]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </mesh>
  );
}

// Fragment pieces for exploded view
function Fragment({ 
  position, 
  rotation, 
  scrollProgress, 
  reducedMotion,
  index 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  scrollProgress: number;
  reducedMotion: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3());
  const basePos = useRef(new THREE.Vector3(...position));
  
  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    
    const isSkillsChapter = scrollProgress > 0.35 && scrollProgress < 0.55;
    const phase = isSkillsChapter 
      ? easeInOutCubic((scrollProgress - 0.35) / 0.2)
      : 0;
    
    const explodeDistance = 0.8 + index * 0.2;
    const angle = (index / 4) * Math.PI * 2;
    
    targetPos.current.x = basePos.current.x + Math.cos(angle) * explodeDistance * phase;
    targetPos.current.y = basePos.current.y + Math.sin(angle * 0.5) * explodeDistance * phase * 0.5;
    targetPos.current.z = basePos.current.z + Math.sin(angle) * explodeDistance * phase * 0.3;
    
    const lerpFactor = 1 - Math.pow(0.02, delta);
    meshRef.current.position.lerp(targetPos.current, lerpFactor);
    meshRef.current.rotation.y = phase * Math.PI * 0.25 * (index % 2 === 0 ? 1 : -1);
  });
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={[0.2, 0.4, 0.08]} />
      <meshPhysicalMaterial
        color="#1a1a2e"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.9}
        envMapIntensity={1}
      />
    </mesh>
  );
}

// Main monolith component
export default function CinematicMonolith({ scrollProgress, reducedMotion }: MonolithProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  const targetScale = useRef(1);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    if (reducedMotion) {
      targetPosition.current = { x: 0, y: 0, z: 0 };
      targetRotation.current = { x: 0, y: 0, z: 0 };
      targetScale.current = 1;
    } else {
      // Chapter 1 (0-0.15): Emerge from darkness
      if (scrollProgress < 0.15) {
        const phase = easeInOutCubic(scrollProgress / 0.15);
        targetPosition.current.z = mapRange(phase, 0, 1, -3, 0);
        targetPosition.current.y = mapRange(phase, 0, 1, -0.5, 0);
        targetRotation.current.y = phase * 0.3;
        targetScale.current = mapRange(phase, 0, 1, 0.5, 1);
      }
      // Chapter 2 (0.15-0.35): Side profile with rotation
      else if (scrollProgress < 0.35) {
        const phase = easeInOutCubic((scrollProgress - 0.15) / 0.2);
        targetPosition.current.z = 0;
        targetPosition.current.x = mapRange(phase, 0, 1, 0, 0.5);
        targetRotation.current.y = 0.3 + phase * 1.2;
        targetRotation.current.x = Math.sin(time * 0.3) * 0.05;
        targetScale.current = 1;
      }
      // Chapter 3 (0.35-0.55): Skills - morphing phase
      else if (scrollProgress < 0.55) {
        const phase = easeInOutCubic((scrollProgress - 0.35) / 0.2);
        targetPosition.current.x = mapRange(phase, 0, 1, 0.5, 0);
        targetRotation.current.y = 1.5 + Math.sin(time * 0.2) * 0.1;
        targetRotation.current.x = mapRange(phase, 0, 1, 0, -0.15);
        targetScale.current = 1 + phase * 0.1;
      }
      // Chapter 4 (0.55-0.75): Projects - exploded layers
      else if (scrollProgress < 0.75) {
        const phase = easeInOutCubic((scrollProgress - 0.55) / 0.2);
        targetPosition.current.x = 0;
        targetRotation.current.y = 1.5 + phase * 0.8;
        targetRotation.current.x = mapRange(phase, 0, 1, -0.15, 0);
        targetScale.current = 1.1 - phase * 0.1;
      }
      // Chapter 5 (0.75-1.0): Final stabilization
      else {
        const phase = easeInOutCubic((scrollProgress - 0.75) / 0.25);
        targetRotation.current.y = 2.3 + phase * 0.5;
        targetRotation.current.x = 0;
        targetPosition.current.y = phase * 0.3;
        targetScale.current = 1 - phase * 0.1;
      }
    }
    
    const lerpFactor = 1 - Math.pow(0.015, delta);
    
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
  
  const fragments = useMemo(() => [
    { position: [-0.4, 0.8, 0.2] as [number, number, number], rotation: [0, 0, 0.1] as [number, number, number] },
    { position: [0.4, 0.8, 0.2] as [number, number, number], rotation: [0, 0, -0.1] as [number, number, number] },
    { position: [-0.4, -0.8, 0.2] as [number, number, number], rotation: [0, 0, -0.1] as [number, number, number] },
    { position: [0.4, -0.8, 0.2] as [number, number, number], rotation: [0, 0, 0.1] as [number, number, number] },
  ], []);
  
  return (
    <group ref={groupRef} position={[0, 0, -3]} scale={0.5}>
      <Float
        speed={1.5}
        rotationIntensity={reducedMotion ? 0 : 0.05}
        floatIntensity={reducedMotion ? 0 : 0.15}
        floatingRange={[-0.05, 0.05]}
      >
        {/* Core monolith */}
        <MonolithCore scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        
        {/* Glass layers */}
        {[0, 1, 2, 3, 4].map((i) => (
          <GlassLayer key={i} index={i} scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        ))}
        
        {/* Accent light */}
        <AccentLight scrollProgress={scrollProgress} />
        
        {/* Floating fragments for exploded view */}
        {fragments.map((frag, i) => (
          <Fragment
            key={i}
            position={frag.position}
            rotation={frag.rotation}
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
            index={i}
          />
        ))}
      </Float>
    </group>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, mapRange, easeInOutCubic } from '@/lib/scroll';

interface MonolithProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

// Custom geometry for morph targets
function createMorphTargets(geometry: THREE.BufferGeometry) {
  const positionAttribute = geometry.getAttribute('position');
  const count = positionAttribute.count;
  
  // Morph target 1: Bent/warped
  const bentPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    
    // Apply bend based on Y position
    const bendFactor = Math.sin(y * 0.5) * 0.3;
    bentPositions[i * 3] = x + bendFactor;
    bentPositions[i * 3 + 1] = y;
    bentPositions[i * 3 + 2] = z + Math.cos(y * 0.3) * 0.15;
  }
  
  // Morph target 2: Twisted
  const twistedPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);
    
    // Apply twist based on Y position
    const angle = y * 0.4;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    twistedPositions[i * 3] = x * cos - z * sin;
    twistedPositions[i * 3 + 1] = y;
    twistedPositions[i * 3 + 2] = x * sin + z * cos;
  }
  
  geometry.morphAttributes.position = [
    new THREE.Float32BufferAttribute(bentPositions, 3),
    new THREE.Float32BufferAttribute(twistedPositions, 3),
  ];
  
  return geometry;
}

// Main monolith slab
function MonolithCore({ scrollProgress, reducedMotion }: MonolithProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Create geometry with morph targets
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.4, 2.8, 0.25, 32, 64, 8);
    return createMorphTargets(geo);
  }, []);
  
  // Animation targets
  const targetMorph = useRef([0, 0]);
  const currentMorph = useRef([0, 0]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    
    const time = state.clock.elapsedTime;
    
    // Chapter-based morph influences
    // Chapter 1 (0-0.15): Object emerges
    // Chapter 2 (0.15-0.35): Bend/warp (philosophy)
    // Chapter 3 (0.35-0.55): Twist transformation (skills)
    // Chapter 4 (0.55-0.75): Return to refined form (projects)
    // Chapter 5 (0.75-1.0): Calm, precise (experience/contact)
    
    if (scrollProgress < 0.15) {
      targetMorph.current = [0, 0];
    } else if (scrollProgress < 0.35) {
      const phase = easeInOutCubic((scrollProgress - 0.15) / 0.2);
      targetMorph.current = [phase * 0.8, 0];
    } else if (scrollProgress < 0.55) {
      const phase = easeInOutCubic((scrollProgress - 0.35) / 0.2);
      targetMorph.current = [0.8 * (1 - phase), phase * 0.6];
    } else if (scrollProgress < 0.75) {
      const phase = easeInOutCubic((scrollProgress - 0.55) / 0.2);
      targetMorph.current = [0, 0.6 * (1 - phase)];
    } else {
      targetMorph.current = [0, 0];
    }
    
    // Smooth interpolation
    const lerpFactor = 1 - Math.pow(0.02, delta);
    currentMorph.current[0] = lerp(currentMorph.current[0], targetMorph.current[0], lerpFactor);
    currentMorph.current[1] = lerp(currentMorph.current[1], targetMorph.current[1], lerpFactor);
    
    // Apply morph targets
    if (meshRef.current.morphTargetInfluences) {
      meshRef.current.morphTargetInfluences[0] = currentMorph.current[0];
      meshRef.current.morphTargetInfluences[1] = currentMorph.current[1];
    }
    
    // Subtle breathing animation
    if (materialRef.current) {
      const breathe = Math.sin(time * 0.5) * 0.05 + 0.95;
      materialRef.current.envMapIntensity = breathe * 1.5;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        ref={materialRef}
        color="#0a0a0a"
        metalness={0.95}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.05}
        reflectivity={1}
        envMapIntensity={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Glass overlay layer
function GlassLayer({ scrollProgress, reducedMotion, offset = 0 }: MonolithProps & { offset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    
    // Explode effect during skills chapter
    let targetZ = 0.14 + offset * 0.08;
    
    if (scrollProgress > 0.35 && scrollProgress < 0.55) {
      const phase = easeInOutCubic((scrollProgress - 0.35) / 0.2);
      targetZ = 0.14 + offset * 0.08 + phase * (0.3 + offset * 0.2);
    }
    
    const lerpFactor = 1 - Math.pow(0.02, delta);
    meshRef.current.position.z = lerp(meshRef.current.position.z, targetZ, lerpFactor);
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0.14 + offset * 0.08]} castShadow>
      <boxGeometry args={[1.3, 2.7, 0.02, 16, 32, 1]} />
      <MeshTransmissionMaterial
        transmission={0.96}
        thickness={0.3}
        roughness={0.02}
        chromaticAberration={0.02}
        ior={1.5}
        color={offset === 0 ? "#ffffff" : offset === 1 ? "#e0f0ff" : "#f0e0ff"}
        distortionScale={0}
        temporalDistortion={0}
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
    
    // Pulse intensity based on scroll
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
    
    // Explode during skills chapter
    const isSkillsChapter = scrollProgress > 0.35 && scrollProgress < 0.55;
    const phase = isSkillsChapter 
      ? easeInOutCubic((scrollProgress - 0.35) / 0.2)
      : 0;
    
    // Each fragment moves outward
    const explodeDistance = 0.8 + index * 0.2;
    const angle = (index / 4) * Math.PI * 2;
    
    targetPos.current.x = basePos.current.x + Math.cos(angle) * explodeDistance * phase;
    targetPos.current.y = basePos.current.y + Math.sin(angle * 0.5) * explodeDistance * phase * 0.5;
    targetPos.current.z = basePos.current.z + Math.sin(angle) * explodeDistance * phase * 0.3;
    
    const lerpFactor = 1 - Math.pow(0.02, delta);
    meshRef.current.position.lerp(targetPos.current, lerpFactor);
    
    // Subtle rotation during explosion
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

// Main monolith group with all elements
export default function CinematicMonolith({ scrollProgress, reducedMotion }: MonolithProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Position/rotation/scale targets
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
      // Chapter 2 (0.15-0.35): Side profile with bend
      else if (scrollProgress < 0.35) {
        const phase = easeInOutCubic((scrollProgress - 0.15) / 0.2);
        targetPosition.current.z = 0;
        targetPosition.current.x = mapRange(phase, 0, 1, 0, 0.5);
        targetRotation.current.y = 0.3 + phase * 1.2;
        targetRotation.current.x = Math.sin(time * 0.3) * 0.05;
        targetScale.current = 1;
      }
      // Chapter 3 (0.35-0.55): Skills - exploded view
      else if (scrollProgress < 0.55) {
        const phase = easeInOutCubic((scrollProgress - 0.35) / 0.2);
        targetPosition.current.x = mapRange(phase, 0, 1, 0.5, 0);
        targetRotation.current.y = 1.5 + Math.sin(time * 0.2) * 0.1;
        targetRotation.current.x = mapRange(phase, 0, 1, 0, -0.15);
        targetScale.current = 1 + phase * 0.1;
      }
      // Chapter 4 (0.55-0.75): Projects - stabilize
      else if (scrollProgress < 0.75) {
        const phase = easeInOutCubic((scrollProgress - 0.55) / 0.2);
        targetPosition.current.x = 0;
        targetRotation.current.y = 1.5 + phase * 0.8;
        targetRotation.current.x = mapRange(phase, 0, 1, -0.15, 0);
        targetScale.current = 1.1 - phase * 0.1;
      }
      // Chapter 5 (0.75-1.0): Calm & precise
      else {
        const phase = easeInOutCubic((scrollProgress - 0.75) / 0.25);
        targetRotation.current.y = 2.3 + phase * 0.5;
        targetRotation.current.x = 0;
        targetPosition.current.y = phase * 0.3;
        targetScale.current = 1 - phase * 0.1;
      }
    }
    
    // Smooth interpolation
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
  
  // Fragment positions
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
        
        {/* Glass layers that separate during skills chapter */}
        <GlassLayer scrollProgress={scrollProgress} reducedMotion={reducedMotion} offset={0} />
        <GlassLayer scrollProgress={scrollProgress} reducedMotion={reducedMotion} offset={1} />
        
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
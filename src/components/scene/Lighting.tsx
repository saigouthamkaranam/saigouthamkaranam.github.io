import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lerp } from '@/lib/scroll';

interface LightingProps {
  scrollProgress: number;
}

export default function Lighting({ scrollProgress }: LightingProps) {
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const sweepLightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Animate sweep light position for Apple-style light sweep effect
    if (sweepLightRef.current) {
      const sweepX = Math.sin(time * 0.3) * 8;
      const sweepY = Math.cos(time * 0.2) * 3 + 2;
      sweepLightRef.current.position.x = sweepX;
      sweepLightRef.current.position.y = sweepY;
      
      // Intensity varies with scroll
      const baseIntensity = 0.8;
      const scrollBoost = scrollProgress > 0.3 && scrollProgress < 0.7 ? 0.4 : 0;
      sweepLightRef.current.intensity = lerp(
        sweepLightRef.current.intensity,
        baseIntensity + scrollBoost,
        1 - Math.pow(0.1, delta)
      );
    }
    
    // Rim light color shift based on chapter
    if (rimLightRef.current) {
      const color = new THREE.Color();
      if (scrollProgress < 0.35) {
        color.setHSL(0.6, 0.8, 0.6); // Blue
      } else if (scrollProgress < 0.55) {
        color.setHSL(0.75, 0.7, 0.6); // Purple
      } else if (scrollProgress < 0.75) {
        color.setHSL(0.55, 0.6, 0.6); // Cyan
      } else {
        color.setHSL(0.6, 0.5, 0.5); // Muted blue
      }
      rimLightRef.current.color.lerp(color, 1 - Math.pow(0.1, delta));
    }
  });
  
  return (
    <>
      {/* Key light - main illumination */}
      <spotLight
        ref={keyLightRef}
        position={[5, 8, 8]}
        angle={0.4}
        penumbra={1}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Sweep light - moving highlight for Apple-style effect */}
      <spotLight
        ref={sweepLightRef}
        position={[0, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
      />
      
      {/* Rim light - edge definition */}
      <pointLight
        ref={rimLightRef}
        position={[-6, 3, -4]}
        intensity={0.6}
        color="#4a9eff"
      />
      
      {/* Fill light - subtle bottom illumination */}
      <pointLight
        ref={fillLightRef}
        position={[0, -4, 4]}
        intensity={0.25}
        color="#8b5cf6"
      />
      
      {/* Ambient - very subtle base */}
      <ambientLight intensity={0.08} />
      
      {/* Hemisphere light for natural feel */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#0a0a0a"
        intensity={0.15}
      />
    </>
  );
}
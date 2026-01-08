import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lerp, mapRange, easeInOutCubic } from '@/lib/scroll';

interface CameraControllerProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

export default function CameraController({ scrollProgress, reducedMotion }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 6));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  useFrame((state, delta) => {
    if (reducedMotion) {
      targetPosition.current.set(0, 0, 5);
      targetLookAt.current.set(0, 0, 0);
    } else {
      const time = state.clock.elapsedTime;
      
      // Chapter-based camera movement
      // Chapter 1: Pull back and reveal
      if (scrollProgress < 0.15) {
        const phase = easeInOutCubic(scrollProgress / 0.15);
        targetPosition.current.set(
          0,
          mapRange(phase, 0, 1, 0.5, 0),
          mapRange(phase, 0, 1, 7, 5)
        );
        targetLookAt.current.set(0, 0, 0);
      }
      // Chapter 2: Subtle orbit
      else if (scrollProgress < 0.35) {
        const phase = (scrollProgress - 0.15) / 0.2;
        targetPosition.current.set(
          Math.sin(phase * Math.PI * 0.3) * 0.5,
          mapRange(phase, 0, 1, 0, 0.3),
          mapRange(phase, 0, 1, 5, 4.5)
        );
        targetLookAt.current.set(0, 0, 0);
      }
      // Chapter 3: Pull back for exploded view
      else if (scrollProgress < 0.55) {
        const phase = (scrollProgress - 0.35) / 0.2;
        targetPosition.current.set(
          0,
          mapRange(phase, 0, 1, 0.3, 0.5),
          mapRange(phase, 0, 1, 4.5, 5.5)
        );
        targetLookAt.current.set(0, 0, 0);
      }
      // Chapter 4: Come closer, stable
      else if (scrollProgress < 0.75) {
        const phase = (scrollProgress - 0.55) / 0.2;
        targetPosition.current.set(
          0,
          mapRange(phase, 0, 1, 0.5, 0.2),
          mapRange(phase, 0, 1, 5.5, 4.5)
        );
        targetLookAt.current.set(0, 0, 0);
      }
      // Chapter 5: Final position
      else {
        const phase = (scrollProgress - 0.75) / 0.25;
        targetPosition.current.set(
          0,
          mapRange(phase, 0, 1, 0.2, 0.5),
          mapRange(phase, 0, 1, 4.5, 5)
        );
        targetLookAt.current.set(0, phase * 0.3, 0);
      }
      
      // Add subtle breathing motion
      const breatheX = Math.sin(time * 0.3) * 0.03;
      const breatheY = Math.cos(time * 0.25) * 0.02;
      targetPosition.current.x += breatheX;
      targetPosition.current.y += breatheY;
    }
    
    // Smooth camera movement
    const lerpFactor = 1 - Math.pow(0.02, delta);
    
    camera.position.lerp(targetPosition.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });
  
  return null;
}
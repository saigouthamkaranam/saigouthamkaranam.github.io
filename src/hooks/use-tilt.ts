import { useState, useCallback, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

interface UseTiltOptions {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}

export function useTilt(options: UseTiltOptions = {}) {
  const { maxTilt = 8, scale = 1.02, perspective = 1000 } = options;
  
  const [tiltState, setTiltState] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  
  const elementRef = useRef<HTMLElement | null>(null);
  const isReducedMotion = useRef(false);
  
  // Check reduced motion preference on mount
  if (typeof window !== 'undefined') {
    isReducedMotion.current = prefersReducedMotion();
  }
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isReducedMotion.current || !elementRef.current) return;
    
    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
    
    setTiltState({
      rotateX,
      rotateY,
      scale,
    });
  }, [maxTilt, scale]);
  
  const handleMouseEnter = useCallback(() => {
    if (isReducedMotion.current) return;
    setTiltState(prev => ({ ...prev, scale }));
  }, [scale]);
  
  const handleMouseLeave = useCallback(() => {
    setTiltState({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  }, []);
  
  const tiltStyle = {
    transform: `perspective(${perspective}px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale(${tiltState.scale})`,
    transition: 'transform 0.15s ease-out',
  };
  
  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);
  
  return {
    ref: setRef,
    style: tiltStyle,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    tiltState,
  };
}

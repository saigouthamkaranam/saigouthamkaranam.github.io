import { useState, useEffect, useCallback, RefObject } from 'react';
import { clamp } from '@/lib/scroll';

interface ScrollProgress {
  progress: number;
  isInView: boolean;
}

export function useScrollProgress(ref: RefObject<HTMLElement>): ScrollProgress {
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate progress based on element position
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    // Progress from when element enters viewport to when it leaves
    const start = viewportHeight;
    const end = -elementHeight;
    const current = elementTop;
    
    const scrollProgress = clamp((start - current) / (start - end), 0, 1);
    
    setProgress(scrollProgress);
    setIsInView(elementTop < viewportHeight && elementTop + elementHeight > 0);
  }, [ref]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return { progress, isInView };
}

export function useGlobalScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setProgress(clamp(scrollProgress, 0, 1));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

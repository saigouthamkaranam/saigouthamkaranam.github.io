import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInView<T extends HTMLElement>(
  options: UseInViewOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', once = false } = options;
  
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const hasTriggered = useRef(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (once) {
          if (inView && !hasTriggered.current) {
            setIsInView(true);
            hasTriggered.current = true;
            observer.disconnect();
          }
        } else {
          setIsInView(inView);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);
  
  return [ref, isInView];
}

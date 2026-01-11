// Motion and scroll utilities for premium interactions

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if device is mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Calculate 3D tilt transform based on mouse position
export const calculateTilt = (
  e: React.MouseEvent<HTMLElement>,
  element: HTMLElement,
  maxTilt: number = 8
): { rotateX: number; rotateY: number } => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;
  
  const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
  const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
  
  return { rotateX, rotateY };
};

// Calculate parallax offset based on mouse position
export const calculateParallax = (
  e: React.MouseEvent<HTMLElement>,
  intensity: number = 20
): { x: number; y: number } => {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  const x = ((e.clientX - centerX) / centerX) * intensity;
  const y = ((e.clientY - centerY) / centerY) * intensity;
  
  return { x, y };
};

// Smooth lerp function for animations
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Easing functions
export const easing = {
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
};

// Spring physics for smooth animations
export const spring = {
  gentle: { stiffness: 120, damping: 14 },
  smooth: { stiffness: 100, damping: 20 },
  slow: { stiffness: 80, damping: 25 },
  premium: { stiffness: 60, damping: 18 },
};

// Scroll-based opacity calculation
export const scrollOpacity = (
  scrollProgress: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number = 1,
  fadeOutEnd: number = 1
): number => {
  if (scrollProgress < fadeInStart) return 0;
  if (scrollProgress < fadeInEnd) {
    return (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
  }
  if (scrollProgress < fadeOutStart) return 1;
  if (scrollProgress < fadeOutEnd) {
    return 1 - (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  }
  return 0;
};

// Specular highlight sweep calculation
export const specularSweep = (
  scrollProgress: number,
  sweepStart: number = 0,
  sweepDuration: number = 0.3
): number => {
  const sweepProgress = (scrollProgress - sweepStart) / sweepDuration;
  if (sweepProgress < 0 || sweepProgress > 1) return 0;
  return Math.sin(sweepProgress * Math.PI);
};

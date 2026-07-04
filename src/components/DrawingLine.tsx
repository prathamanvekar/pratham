import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface DrawingLineProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  delay?: number;
  duration?: number;
  animate?: boolean;
}

export const DrawingLine = ({
  direction = 'horizontal',
  className = '',
  delay = 0,
  duration = 1.2,
  animate = true,
}: DrawingLineProps) => {
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    if (!animate) {
      gsap.set(lineRef.current, { strokeDashoffset: 0 });
      return;
    }

    // Set initial stroke-dashoffset to 1
    gsap.set(lineRef.current, { strokeDashoffset: 1 });

    const anim = gsap.to(lineRef.current, {
      strokeDashoffset: 0,
      duration: duration,
      delay: delay,
      ease: 'power2.out',
    });

    return () => {
      anim.kill();
    };
  }, [delay, duration, animate]);

  return (
    <svg
      className={`absolute pointer-events-none select-none ${className}`}
      width={direction === 'horizontal' ? '100%' : '1'}
      height={direction === 'vertical' ? '100%' : '1'}
      style={{ overflow: 'visible' }}
    >
      <line
        ref={lineRef}
        x1="0"
        y1="0"
        x2={direction === 'horizontal' ? '100%' : '0'}
        y2={direction === 'vertical' ? '100%' : '0'}
        stroke="currentColor"
        strokeWidth="1"
        pathLength="1"
        strokeDasharray="1"
        style={{ strokeDashoffset: 1 }}
      />
    </svg>
  );
};

export default DrawingLine;

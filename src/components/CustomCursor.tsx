import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';

// A position: fixed element is positioned relative to the viewport UNLESS an
// ancestor establishes a containing block (transform, perspective, filter,
// will-change of those, or contain). When that happens, the cursor's translate
// no longer maps to viewport coordinates, so we measure and compensate for it.
const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<SVGSVGElement>(null);
  const snapBoxRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);

  const mousePos = useRef({ x: -100, y: -100 });
  const isTouchDevice = useRef(false);
  const containingBlockRef = useRef<HTMLElement | null>(null);

  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const constants = useMemo(() => ({ cornerSize: 6, paddingX: 6, paddingY: 4 }), []);

  useEffect(() => {
    const checkTouch = () => {
      isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouchDevice.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.nav-link, a, button, [data-cursor-snap]');
      if (target) {
        setHoveredEl(target as HTMLElement);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.nav-link, a, button, [data-cursor-snap]');
      if (target) {
        setHoveredEl(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    if (cursorRef.current) {
      containingBlockRef.current = getContainingBlock(cursorRef.current);
    }

    gsap.set(cursorRef.current, { opacity: 0 });

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Update container position and corner offsets in the render loop
  useEffect(() => {
    if (isTouchDevice.current) return;
    if (!dotRef.current || !crosshairRef.current || !cursorRef.current) return;

    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    const setDotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.08, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.08, ease: 'power2.out' });
    const setCrosshairX = gsap.quickTo(crosshairRef.current, 'x', { duration: 0.12, ease: 'power2.out' });
    const setCrosshairY = gsap.quickTo(crosshairRef.current, 'y', { duration: 0.12, ease: 'power2.out' });

    const tick = () => {
      if (!cursorRef.current) return;

      const { x: offsetX, y: offsetY } = getOffset();
      
      const curX = mousePos.current.x - offsetX;
      const curY = mousePos.current.y - offsetY;
      
      gsap.set(cursorRef.current, { x: curX, y: curY });

      // Keep pointer dot and crosshair locked to container origin (mouse position)
      setDotX(0);
      setDotY(0);
      setCrosshairX(0);
      setCrosshairY(0);

      const collapsedPositions = [
        { x: -constants.cornerSize, y: -constants.cornerSize },
        { x: 0, y: -constants.cornerSize },
        { x: 0, y: 0 },
        { x: -constants.cornerSize, y: 0 }
      ];

      let targetPos;
      const rect = hoveredEl && hoveredEl.isConnected ? hoveredEl.getBoundingClientRect() : null;

      if (rect && rect.width > 0 && rect.height > 0) {
        const { cornerSize, paddingX, paddingY } = constants;

        // Dynamic coordinate calculation relative to cursor center coordinate (curX, curY)
        targetPos = [
          { x: rect.left - paddingX - offsetX - curX, y: rect.top - paddingY - offsetY - curY },
          { x: rect.right + paddingX - cornerSize - offsetX - curX, y: rect.top - paddingY - offsetY - curY },
          { x: rect.right + paddingX - cornerSize - offsetX - curX, y: rect.bottom + paddingY - cornerSize - offsetY - curY },
          { x: rect.left - paddingX - offsetX - curX, y: rect.bottom + paddingY - cornerSize - offsetY - curY }
        ];
      } else {
        targetPos = collapsedPositions;
        if (hoveredEl) {
          requestAnimationFrame(() => {
            setHoveredEl(null);
          });
        }
      }

      cornersRef.current.forEach((corner, i) => {
        if (!corner) return;
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;
        
        // Smooth snap lerp
        const ease = 0.18;
        const finalX = currentX + (targetPos[i].x - currentX) * ease;
        const finalY = currentY + (targetPos[i].y - currentY) * ease;

        gsap.set(corner, { x: finalX, y: finalY });
      });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [hoveredEl, constants]);

  // Add isFirefox check for Zen/Firefox browser support fallback
  const isFirefox = useMemo(() => {
    return typeof window !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isTouchDevice.current && !isFirefox) {
      document.documentElement.classList.add('has-custom-cursor');
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('has-custom-cursor');
      }
    };
  }, [isFirefox]);

  // Handle bracket container opacity transition on hover
  useEffect(() => {
    if (isTouchDevice.current || isFirefox) return;
    if (hoveredEl) {
      gsap.to(snapBoxRef.current, { opacity: 1, duration: 0.2, overwrite: 'auto' });
    } else {
      gsap.to(snapBoxRef.current, { opacity: 0, duration: 0.2, overwrite: 'auto' });
    }
  }, [hoveredEl, isFirefox]);

  if (isTouchDevice.current || isFirefox) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-container fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] hidden md:block"
      style={{ willChange: 'transform' }}
    >
      {/* Central Dot */}
      <div
        ref={dotRef}
        className="absolute w-1 h-1 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ top: 0, left: 0 }}
      />

      {/* Crosshair */}
      <svg
        ref={crosshairRef}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        className="absolute -translate-x-1/2 -translate-y-1/2 text-accent/40"
        style={{ top: 0, left: 0 }}
      >
        <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Snap Corners Container */}
      <div
        ref={snapBoxRef}
        className="absolute top-0 left-0 pointer-events-none opacity-0"
        style={{ top: 0, left: 0 }}
      >
        {/* Top-Left Corner */}
        <div
          ref={el => { if (el) cornersRef.current[0] = el; }}
          className="cursor-bracket cursor-bracket-tl"
          style={{ top: 0, left: 0, position: 'absolute' }}
        />
        {/* Top-Right Corner */}
        <div
          ref={el => { if (el) cornersRef.current[1] = el; }}
          className="cursor-bracket cursor-bracket-tr"
          style={{ top: 0, left: 0, position: 'absolute' }}
        />
        {/* Bottom-Right Corner */}
        <div
          ref={el => { if (el) cornersRef.current[2] = el; }}
          className="cursor-bracket cursor-bracket-br"
          style={{ top: 0, left: 0, position: 'absolute' }}
        />
        {/* Bottom-Left Corner */}
        <div
          ref={el => { if (el) cornersRef.current[3] = el; }}
          className="cursor-bracket cursor-bracket-bl"
          style={{ top: 0, left: 0, position: 'absolute' }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;

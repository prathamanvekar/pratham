import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';

interface Dot {
  cx: number;
  cy: number;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 2.5,
  gap = 26,
  baseColor = '#2F293A',
  activeColor = '#bd93f9',
  proximity = 100,
  className = '',
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000 });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy });
      }
    }
    dotsRef.current = dots;

    // Mobile/tablet check: draw static base dots once
    const isMobile = window.innerWidth < 1024;
    if (isMobile && ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.fillStyle = baseColor;
      const radius = dotSize / 2;
      for (const dot of dots) {
        ctx.moveTo(dot.cx + radius, dot.cy);
        ctx.arc(dot.cx, dot.cy, radius, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }, [dotSize, gap, baseColor]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;
      const radius = dotSize / 2;

      // 1. Batch draw all static base-colored dots (outside mouse range) in one single path call
      ctx.beginPath();
      ctx.fillStyle = baseColor;
      for (const dot of dotsRef.current) {
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        if (dsq <= proxSq) {
          continue;
        }

        ctx.moveTo(dot.cx + radius, dot.cy);
        ctx.arc(dot.cx, dot.cy, radius, 0, Math.PI * 2);
      }
      ctx.fill();

      // 2. Draw only highlighted dots near the cursor individually with dynamic gradients
      for (const dot of dotsRef.current) {
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        if (dsq > proxSq) {
          continue;
        }

        const dist = Math.sqrt(dsq);
        const t = 1 - dist / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        const style = `rgb(${r},${g},${b})`;

        ctx.beginPath();
        ctx.fillStyle = style;
        ctx.arc(dot.cx, dot.cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, dotSize]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    const win = window as any;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      win.addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else win.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;

      // Dynamic inverse parallax shift on the canvas container
      const moveX = (e.clientX - window.innerWidth / 2) * -0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * -0.015;
      gsap.to(canvas, { x: moveX, y: moveY, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    };

    const onLeave = () => {
      pointerRef.current.x = -1000;
      pointerRef.current.y = -1000;

      const canvas = canvasRef.current;
      if (canvas) {
        gsap.to(canvas, { x: 0, y: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`w-full h-full relative ${className}`} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};

export default DotGrid;

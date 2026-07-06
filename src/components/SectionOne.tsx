import { forwardRef, useMemo, useRef, useEffect, useState } from 'react';
import type { RefObject, CSSProperties, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import profileImage from '../assets/image.png';
import DrawingLine from './DrawingLine';
import PixelTransition from './PixelTransition';

interface SectionOneProps {
  onNavigateProject?: (slug: string) => void;
}

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  style?: CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };
    const containerRect = containerRef.current.getBoundingClientRect();

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        mousePositionRef.current.x,
        mousePositionRef.current.y,
        letterCenterX,
        letterCenterY
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        ...style
      }}
      className={className}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex]
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';

const SectionOne = ({ onNavigateProject }: SectionOneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=anvekarprathamesh13@gmail.com', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-24 md:pt-28 lg:pt-24 pb-6 md:pb-8 lg:pb-8 relative overflow-hidden lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 w-full max-w-[76rem] h-auto lg:max-h-[85vh] lg:overflow-y-auto lg:no-scrollbar">

        {/* Left Column - Profile Details */}
        <div ref={containerRef} className="col-span-1 lg:col-span-4 flex flex-col justify-between h-auto py-2 relative">
          <div>
            {/* Profile image with pixel transition on hover */}
            <motion.div
              layoutId="profile-pic"
              className="mb-6"
              style={{ width: 192, height: 192 }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              <PixelTransition
                aspectRatio="100%"
                gridSize={9}
                pixelColor="var(--color-bg)"
                animationStepDuration={0.3}
                className="rounded-lg border border-border/20"
                style={{ width: 192, height: 192 }}
                firstContent={
                  <img
                    src={profileImage}
                    alt="profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                }
                secondContent={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      backgroundColor: 'var(--color-bg)',
                    }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 900,
                      fontSize: '1.25rem',
                      color: 'var(--color-link)',
                      textAlign: 'center',
                      margin: 0,
                      lineHeight: 1.3,
                      padding: '8px',
                    }}>
                      i know im<br />handsome, but damn!
                    </p>
                  </div>
                }
              />
            </motion.div>

            <motion.h1
              layoutId="developer-name"
              layout="position"
              className="text-2xl md:text-3xl tracking-tight mb-1 text-text font-normal lowercase flex flex-wrap whitespace-nowrap lg:w-[280px]"
              style={{ lineHeight: 1.2 }}
              transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
            >
              {isDesktop ? (
                <span 
                  className="flex flex-row flex-nowrap font-normal select-none whitespace-nowrap"
                  style={{
                    "--hover-padding": "0px",
                    "--text-stroke-width": "calc(1em * 100 / 6000)",
                  } as React.CSSProperties}
                >
                  {"prathamesh anvekar".split("").map((letter, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="name-letter [will-change:font-weight,-webkit-text-stroke-width] [-webkit-text-stroke-color:transparent] [-webkit-text-stroke-width:var(--text-stroke-width)] [transition:font-weight_0.4s,_-webkit-text-stroke-color_0.4s] hover:font-[700] hover:[-webkit-text-stroke-color:currentcolor] hover:[-webkit-text-stroke-width:calc(var(--text-stroke-width)*1.5)] has-[+span:hover]:font-[500] [:hover+&]:font-[500] has-[+span+span:hover]:font-[450] [:hover+span+&]:font-[450]"
                      style={letter === ' ' ? { display: 'inline-block', width: '0.3em' } : { display: 'inline-block' }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </span>
              ) : (
                "prathamesh anvekar".split("").map((letter, i) => (
                  <span 
                    key={i} 
                    className="name-letter" 
                    style={letter === ' ' ? { display: 'inline-block', width: '0.4em' } : { display: 'inline-block' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))
              )}
            </motion.h1>
            <h2 className="text-xs text-accent lowercase mb-4 font-mono">backend & ai dev</h2>

            {/* Tagline */}
            <div className="mb-6 max-w-xs cursor-default">
              <p className="text-xs md:text-sm text-muted lowercase leading-relaxed font-mono">
                i build software that i'll love to use, practical, performant and something that'll help people.
              </p>
            </div>

            <div className="mb-6 font-mono">
              <p className="text-xs text-text lowercase">
                go | python | c/c++ | postgresql | pytorch | mern
              </p>
            </div>

            <div className="mb-8">
              <a
                href="https://share.google/CjkzGXEMQfoCKKsZ5"
                target="_blank"
                rel="noopener noreferrer"
                className="underlined-link text-xs lowercase font-mono pb-0.5"
              >based in pune, india</a>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <a
              href="https://github.com/prathamanvekar"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link github"
            >
              <span><Github size={16} /></span>
            </a>
            <a
              href="https://www.linkedin.com/in/prathamanvekar/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link linkedin"
            >
              <span><Linkedin size={16} /></span>
            </a>
            <a
              href="https://twitter.com/prathamiscool"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link twitter"
            >
              <span><Twitter size={16} /></span>
            </a>
            <a
              href="mailto:anvekarprathamesh13@gmail.com"
              onClick={handleEmailClick}
              className="social-icon-link email"
            >
              <span><Mail size={16} /></span>
            </a>
          </div>
        </div>

        {/* Right Column - Work Experience & Top Projects */}
        <div className="col-span-1 lg:col-span-8 flex flex-col justify-start space-y-10 lg:pt-3">

          {/* Work Experience */}
          <div className="space-y-4">
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              work experience
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.4} />
            </div>

            <div className="font-mono text-xs md:text-sm">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-text font-bold">qriocity pvt ltd</span>
                <span className="text-xs text-muted">jan 26 - mar 26</span>
              </div>
              <span className="text-xs text-muted italic block mb-1">machine learning developer</span>
              <p className="text-muted text-xs leading-relaxed">
                designed, trained, and deployed end-to-end deep learning models and scalable fastapi inference systems for complex multi-domain ai pipelines.
              </p>
            </div>
          </div>

          {/* Featured Top Projects */}
          <div className="space-y-4 pt-4 relative">
            <DrawingLine direction="horizontal" className="top-0 left-0 text-border/30" delay={0.5} />
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              featured top projects
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.6} />
            </div>

            <div className="space-y-5 font-mono">
              {/* ergen */}
              <div>
                <div className="flex justify-between items-baseline">
                  <button
                    onClick={() => onNavigateProject?.('ergen')}
                    className="bg-transparent border-none p-0 outline-none cursor-pointer text-left"
                  >
                    <motion.h3
                      layoutId="home-title-ergen"
                      layout="position"
                      className="underlined-link font-bold text-xs md:text-sm text-text"
                      transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
                    >
                      ergen
                    </motion.h3>
                  </button>
                  <span className="text-[11px] text-muted">go / 2026</span>
                </div>
                <p className="text-muted text-xs mt-1 leading-relaxed">
                  an ast driven local first tool for automating go's repetitive error handling, allowing for custom error handling for dynamic project specific workflows.
                </p>
              </div>

              {/* ebfer */}
              <div>
                <div className="flex justify-between items-baseline">
                  <button
                    onClick={() => onNavigateProject?.('ebfer')}
                    className="bg-transparent border-none p-0 outline-none cursor-pointer text-left"
                  >
                    <motion.h3
                      layoutId="home-title-ebfer"
                      layout="position"
                      className="underlined-link font-bold text-xs md:text-sm text-text"
                      transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
                    >
                      ebfer
                    </motion.h3>
                  </button>
                  <span className="text-[11px] text-muted">c / seccomp-bpf / 2026</span>
                </div>
                <p className="text-muted text-xs mt-1 leading-relaxed">
                  a policy-driven c sandboxing engine using seccomp-bpf filters to enforce kernel-level syscall restrictions, secure process execution via fork/exec, and log runtime violations.
                </p>
              </div>

              {/* proxie */}
              <div>
                <div className="flex justify-between items-baseline">
                  <button
                    onClick={() => onNavigateProject?.('proxie')}
                    className="bg-transparent border-none p-0 outline-none cursor-pointer text-left"
                  >
                    <motion.h3
                      layoutId="home-title-proxie"
                      layout="position"
                      className="underlined-link font-bold text-xs md:text-sm text-text"
                      transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
                    >
                      proxie
                    </motion.h3>
                  </button>
                  <span className="text-[11px] text-muted">python / gemma / react / 2026</span>
                </div>
                <p className="text-muted text-xs mt-1 leading-relaxed">
                  a security-first gateway that secures ai workflows and local quantized gemma 3 inference using a threat detection pipeline to sanitize pii, block prompt injections, and log telemetry.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SectionOne;

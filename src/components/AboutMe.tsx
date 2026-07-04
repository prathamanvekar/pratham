import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import profileImage from '../assets/image.png';
import DrawingLine from './DrawingLine';
import PixelTransition from './PixelTransition';
import Highlighter from './Highlighter';

interface AboutMeProps {
  onBack?: () => void;
  theme?: 'dark' | 'light';
}

const AboutMe = ({ onBack, theme }: AboutMeProps) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const highlightColor = theme === 'light'
    ? 'rgba(124, 58, 237, 0.22)'
    : 'rgba(189, 147, 249, 0.25)';

  const outlineColor = theme === 'light'
    ? 'rgba(124, 58, 237, 0.55)'
    : 'rgba(189, 147, 249, 0.65)';

  return (
    <motion.section
      key="about-page"
      layoutScroll
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-20 lg:pt-24 pb-12 lg:pb-8 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          onClick={onBack}
          className="absolute top-20 lg:top-24 left-6 md:left-12 lg:left-20 flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors duration-200 font-mono cursor-pointer bg-transparent border-none p-0 outline-none z-20"
        >
          <ArrowLeft size={13} />
          back
        </motion.button>
      )}

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-[76rem] h-auto lg:max-h-[85vh] lg:overflow-y-auto lg:no-scrollbar relative z-10 items-start lg:items-center pt-8 lg:pt-0">

        <div className="w-full lg:w-[256px] flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
          <motion.div
            layoutId="profile-pic"
            className="overflow-hidden rounded-lg border border-border/20"
            style={{ width: 256, height: 256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            <PixelTransition
              aspectRatio="100%"
              gridSize={9}
              pixelColor="var(--color-bg)"
              animationStepDuration={0.3}
              style={{ width: 256, height: 256 }}
              firstContent={
                <img
                  src={profileImage}
                  alt="profile photo"
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
                    fontSize: '1.15rem',
                    color: 'var(--color-link)',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.3,
                    padding: '8px',
                  }}>
                    okay fine,<br />i'm cool too
                  </p>
                </div>
              }
            />
          </motion.div>
          
          <motion.h1
            layoutId="developer-name"
            layout="position"
            className="text-lg md:text-xl tracking-tight text-text font-normal lowercase font-mono mt-2 whitespace-nowrap"
            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
          >
            {isDesktop ? (
              <span 
                className="flex flex-row flex-nowrap font-[300] select-none whitespace-nowrap"
                style={{
                  "--hover-padding": "calc(1em / 12)",
                  "--text-stroke-width": "calc(1em * 125 / 6000)",
                } as React.CSSProperties}
              >
                {"prathamesh anvekar".split("").map((letter, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="[will-change:font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:transparent] [-webkit-text-stroke-width:var(--text-stroke-width)] [transition:font-weight_0.4s,_-webkit-text-stroke-color_0.4s,_padding_0.4s] hover:[padding-inline:var(--hover-padding)] hover:font-[900] hover:[-webkit-text-stroke-color:currentcolor] hover:[-webkit-text-stroke-width:calc(var(--text-stroke-width)*2)] has-[+span+span:hover]:font-[400] has-[+span:hover]:[padding-inline:var(--hover-padding)] has-[+span:hover]:font-[600] [:hover+&]:[padding-inline:var(--hover-padding)] [:hover+&]:font-[600] [:hover+span+&]:font-[400]"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </span>
            ) : (
              "prathamesh anvekar"
            )}
          </motion.h1>
        </div>

        {/* Text Bio */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            >
              <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max mb-4">
                about me
                <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.4} />
              </div>
            </motion.div>

            <motion.div
              className="space-y-6 text-muted font-mono text-xs md:text-sm leading-relaxed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease: 'easeOut' }}
            >
              <p>
                obsessed with <Highlighter action="highlight" color={highlightColor} isView={true}>system architecture</Highlighter> and the raw mechanics of <Highlighter action="highlight" color={highlightColor} isView={true}>ai</Highlighter>.
              </p>

              <p>
                proficient in <Highlighter action="circle" color={outlineColor} strokeWidth={1.5} padding={3} isView={true}>go</Highlighter>. right now, i'm writing a <Highlighter action="underline" color={outlineColor} strokeWidth={2} padding={1} isView={true}>custom http server</Highlighter> from scratch to deconstruct networking protocols and backend architecture from the ground up.
              </p>

              <p>
                <Highlighter action="highlight" color={highlightColor} isView={true}>python</Highlighter> is second nature. i've shipped pipelines across traditional deep learning frameworks and am currently diving deep into autonomous agent orchestrations and multi-agent systems.
              </p>

              <div>
                <span className="text-xs uppercase text-muted block mb-0.5 font-mono">education</span>
                <p className="text-text font-mono">
                  final year btech <Highlighter action="box" color={outlineColor} strokeWidth={1.5} padding={4} isView={true}>@ vit, pune</Highlighter> — graduating <Highlighter action="highlight" color={highlightColor} padding={3} isView={true}>'27</Highlighter>.
                </p>
              </div>

              <div className="pb-12">
                <span className="text-xs uppercase text-muted block mb-0.5 font-mono">interests</span>
                <p className="text-text font-mono">
                  and about me, i love nature, max richter and <Highlighter action="circle" color={outlineColor} strokeWidth={1.5} padding={3} isView={true}>me</Highlighter>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </motion.section>
  );
};

export default AboutMe;

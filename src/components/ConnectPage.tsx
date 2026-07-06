import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Terminal,
  Code2,
  Cpu,
  Award,
  MapPin,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import yujiGif from '../assets/yujistare.gif';
import DrawingLine from './DrawingLine';
import PixelTransition from './PixelTransition';

interface LinkItem {
  name: string;
  url: string;
  handle: string;
  color: string;
}

const socialLinks: LinkItem[] = [
  {
    name: 'github',
    url: 'https://github.com/prathamanvekar',
    handle: 'github/pratham',
    color: '#a3a3a3',
  },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/prathamanvekar/',
    handle: 'linkedin/pratham',
    color: '#0077b5',
  },
  {
    name: 'twitter/x',
    url: 'https://twitter.com/prathamiscool',
    handle: 'twitter/pratham',
    color: '#1da1f2',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/prathamanvekar/',
    handle: 'instagram/pratham',
    color: '#e1306c',
  },
  {
    name: 'reddit',
    url: 'https://www.reddit.com/user/prathamanvekar/',
    handle: 'reddit/u/pratham',
    color: '#ff4500',
  },
];

const codeLinks: LinkItem[] = [
  {
    name: 'boot.dev',
    url: 'https://www.boot.dev/u/prathamanvekar',
    handle: 'boot.dev/pratham',
    color: '#f39c12',
  },
  {
    name: 'leetcode',
    url: 'https://leetcode.com/u/prathamanvekar/',
    handle: 'leetcode/pratham',
    color: '#ffa116',
  },
  {
    name: 'codeforces',
    url: 'https://codeforces.com/profile/prathamanvekar',
    handle: 'codeforces/pratham',
    color: '#3182ce',
  },
  {
    name: 'codechef',
    url: 'https://www.codechef.com/users/prathamanvekar',
    handle: 'codechef/pratham',
    color: '#a0522d',
  },
];

const getIcon = (name: string) => {
  switch (name) {
    case 'github':
      return Github;
    case 'linkedin':
      return Linkedin;
    case 'twitter/x':
      return Twitter;
    case 'instagram':
      return Instagram;
    case 'reddit':
      return Globe;
    case 'boot.dev':
      return Terminal;
    case 'leetcode':
      return Code2;
    case 'codeforces':
      return Cpu;
    case 'codechef':
      return Award;
    default:
      return Globe;
  }
};

const getIstTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

// Motion animation variants
const textContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.35,
      staggerChildren: 0.025,
    },
  },
};

const textLetter: Variants = {
  hidden: { opacity: 0, y: 3 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
};

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },
};

const LinkTile = ({ item }: { item: LinkItem }) => {
  const Icon = getIcon(item.name);
  return (
    <motion.div variants={cardVariant}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-snap
        className="group flex items-center justify-between py-1.5 border-b border-border/10 hover:border-link/35 transition-colors duration-300 ease-out font-mono text-sm text-text select-none decoration-none"
      >
        <div className="flex items-center gap-2.5 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1.5">
          <Icon
            size={14}
            className="transition-all duration-300 flex-shrink-0 opacity-60 group-hover:opacity-100"
            style={{ color: item.color }}
          />
          <span className="font-bold tracking-wide transition-colors duration-200 group-hover:text-accent">
            {item.name}
          </span>
        </div>

        <div className="flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-x-0.5">
          <span className="text-xs text-muted/60 group-hover:text-text transition-colors duration-200">
            {item.handle}
          </span>
          <span className="text-muted/30 group-hover:text-link transition-colors duration-300 overflow-hidden flex items-center justify-center w-3 h-3">
            <ArrowUpRight size={11} className="transform -translate-x-1 translate-y-1 opacity-20 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]" />
          </span>
        </div>
      </a>
    </motion.div>
  );
};

export const ConnectPage = () => {
  const stalkerText = "why u stalking me cuh";
  const email = 'anvekarprathamesh13@gmail.com';
  const [copied, setCopied] = useState(false);
  const [istTime, setIstTime] = useState(getIstTime);

  useEffect(() => {
    const id = setInterval(() => setIstTime(getIstTime()), 30000);
    return () => clearInterval(id);
  }, []);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <motion.section
      key="connect-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-start lg:items-center justify-center px-6 md:px-12 lg:px-20 pt-16 lg:pt-20 pb-12 lg:pb-6 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 w-full max-w-[68rem] h-auto lg:max-h-[80vh] lg:overflow-y-auto lg:no-scrollbar relative z-10 pt-10 lg:pt-0">

        {/* Left Column: Minimal Stare Graphic + Status */}
        <div className="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-start justify-start lg:pt-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.05 }}
            className="overflow-hidden rounded-xl bg-transparent"
          >
            <PixelTransition
              aspectRatio="100%"
              gridSize={10}
              pixelColor="var(--color-bg)"
              animationStepDuration={0.25}
              className="rounded-xl"
              style={{ width: 180, height: 180 }}
              firstContent={
                <img
                  src={yujiGif}
                  alt="animated character giving an intense stare, revealed on hover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
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
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: 'var(--color-link)',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.4,
                    padding: '8px',
                  }}>
                    this is getting<br />serious now 😭
                  </p>
                </div>
              }
            />
          </motion.div>

          {/* Letter-staggered caption */}
          <div className="mt-3 flex flex-col items-center lg:items-start select-none">
            <motion.div
              variants={textContainer}
              initial="hidden"
              animate="visible"
              className="flex gap-[1px]"
            >
              {Array.from(stalkerText).map((char, index) => (
                <motion.span
                  key={index}
                  variants={textLetter}
                  className="text-xs md:text-sm text-muted/65 font-mono tracking-wider lowercase inline-block"
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Status + location block */}
          <div className="mt-5 flex flex-col items-center lg:items-start select-none">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
              className="flex flex-col items-start gap-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-muted">
                <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ backgroundColor: 'var(--color-link)' }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ backgroundColor: 'var(--color-link)' }}
                    />
                  </span>
                </span>
                open to freelance &amp; internships
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted/70 font-mono">
                <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                  <MapPin size={11} className="text-muted/50" />
                </span>
                pune, india
                <span className="text-muted/30">·</span>
                {istTime} ist
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Contact Card + Grouped Directory */}
        <div className="col-span-1 lg:col-span-8 flex flex-col justify-start">
          <div className="space-y-4 lg:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
              className="relative max-w-max"
            >
              <div className="text-xs font-bold tracking-widest text-muted uppercase font-mono pb-2 relative max-w-max">
                connect
                <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.15} />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14, ease: 'easeOut' }}
              className="-mt-2 text-sm text-muted font-mono leading-relaxed max-w-xl"
            >
              always down to talk shop — systems design, ai agents, competitive programming, or your next big idea. reach out, i reply fast.
            </motion.p>

            {/* Contact terminal card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
              className="w-full max-w-xl rounded-lg border border-border/10 overflow-hidden bg-transparent"
            >
              <div className="flex items-center gap-1 pl-3 pr-4 py-2 border-b border-border/10 bg-transparent">
                <span className="w-1 h-1 rounded-full bg-muted/35" />
                <span className="w-1 h-1 rounded-full bg-muted/35" />
                <span className="w-1 h-1 rounded-full bg-muted/35" />
                <span className="ml-1 text-[10px] text-muted/50 font-mono lowercase">contact.sh</span>
              </div>
              <div className="px-5 py-3.5 lg:py-2.5 font-mono text-xs md:text-sm space-y-2 lg:space-y-1.5">
                <div>
                  <span className="text-link">$</span> <span className="text-muted">whoami</span>
                </div>
                <div className="text-text/80 pl-3">prathamesh anvekar — backend &amp; ai dev</div>
                <div className="pt-0.5">
                  <span className="text-link">$</span> <span className="text-muted">cat contact.txt</span>
                </div>
                <div className="pl-3 flex items-center justify-between gap-3 flex-wrap">
                  <a
                    href={`mailto:${email}`}
                    onClick={handleEmailClick}
                    data-cursor-snap
                    className="text-text hover:text-accent transition-colors duration-200 underline decoration-dashed decoration-muted/50 underline-offset-4 decoration-1"
                  >
                    {email}
                  </a>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={handleCopyEmail}
                      data-cursor-snap
                      className="flex items-center gap-1 text-muted hover:text-link transition-colors duration-200 bg-transparent border-none p-0 outline-none cursor-pointer"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-1 text-link"
                          >
                            <Check size={12} /> copied
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-1"
                          >
                            <Copy size={11} /> copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <a
                      href={`mailto:${email}`}
                      onClick={handleEmailClick}
                      data-cursor-snap
                      className="flex items-center gap-1 text-link hover:text-accent transition-colors duration-200 decoration-none"
                    >
                      <Send size={11} /> say hello
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grouped directory list: 2-column layout on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 lg:gap-y-3 pt-0 w-full max-w-xl">

              {/* Elsewhere: socials */}
              <div className="space-y-2 lg:space-y-1">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.28, ease: 'easeOut' }}
                  className="text-[10px] font-bold tracking-widest text-muted uppercase font-mono border-b border-border/5 pb-1"
                >
                  elsewhere
                </motion.div>
                <motion.div
                  variants={gridContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-0"
                >
                  {socialLinks.map((item) => (
                    <LinkTile key={item.name} item={item} />
                  ))}
                </motion.div>
              </div>

              {/* Competitive & code profiles */}
              <div className="space-y-2 lg:space-y-1">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.34, ease: 'easeOut' }}
                  className="text-[10px] font-bold tracking-widest text-muted uppercase font-mono border-b border-border/5 pb-1"
                >
                  competitive &amp; code
                </motion.div>
                <motion.div
                  variants={gridContainer}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-0"
                >
                  {codeLinks.map((item) => (
                    <LinkTile key={item.name} item={item} />
                  ))}
                </motion.div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
};

export default ConnectPage;

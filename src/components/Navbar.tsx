import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import StaggeredMenu from './StaggeredMenu';

type NavPage = 'portfolio' | 'about' | 'projects' | 'posts' | 'connect' | 'project' | 'post';

interface NavbarProps {
  scrollToSection: (index: number) => void;
  theme: 'dark' | 'light';
  toggleTheme: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  activeIndex: number;
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  onBack?: () => void;
}

const Navbar = ({ 
  scrollToSection, 
  theme, 
  toggleTheme, 
  activeIndex,
  currentPage,
  setCurrentPage,
  onBack
}: NavbarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isPortfolio = currentPage === 'portfolio';
  const prevIsPortfolio = useRef(isPortfolio);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!numbersRef.current || !homeRef.current || !barRef.current || !containerRef.current || !wrapperRef.current) {
      return;
    }
    const w_nums = numbersRef.current.getBoundingClientRect().width;
    const w_home = homeRef.current.getBoundingClientRect().width;

    // Set initial layout position without animation on mount
    if (prevIsPortfolio.current === isPortfolio) {
      if (isPortfolio) {
        gsap.set(numbersRef.current, { clipPath: 'inset(0 0% 0 0)', visibility: 'visible' });
        gsap.set(homeRef.current, { clipPath: 'inset(0 100% 0 0)', visibility: 'hidden' });
        gsap.set(barRef.current, { left: w_nums + 32 });
        gsap.set(containerRef.current, { width: w_nums });
        gsap.set(wrapperRef.current, { width: w_nums + 32 });
      } else {
        gsap.set(numbersRef.current, { clipPath: 'inset(0 100% 0 0)', visibility: 'hidden' });
        gsap.set(homeRef.current, { clipPath: 'inset(0 0% 0 0)', visibility: 'visible' });
        gsap.set(barRef.current, { left: w_home + 32 });
        gsap.set(containerRef.current, { width: w_home });
        gsap.set(wrapperRef.current, { width: w_home + 32 });
      }
      return;
    }

    // Orchestrate the sweep timeline
    const tl = gsap.timeline();

    if (!isPortfolio) {
      // 1. Sweep Left: Hide numbers
      tl.to(barRef.current, {
        left: 0,
        duration: 0.35,
        ease: 'power2.inOut'
      })
      .to(numbersRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.35,
        ease: 'power2.inOut'
      }, 0)
      
      // 2. Switch visible elements and shrink container/wrapper width
      .call(() => {
        gsap.set(numbersRef.current, { visibility: 'hidden' });
        gsap.set(homeRef.current, { visibility: 'visible' });
      })
      .to(containerRef.current, {
        width: w_home,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      .to(wrapperRef.current, {
        width: w_home + 32,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.3')

      // 3. Sweep Right: Reveal home
      .to(barRef.current, {
        left: w_home + 32,
        duration: 0.35,
        ease: 'power2.inOut'
      })
      .to(homeRef.current, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.35,
        ease: 'power2.inOut'
      }, '-=0.35');
    } else {
      // 1. Sweep Left: Hide home
      tl.to(barRef.current, {
        left: 0,
        duration: 0.35,
        ease: 'power2.inOut'
      })
      .to(homeRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.35,
        ease: 'power2.inOut'
      }, 0)

      // 2. Switch visible elements and expand container/wrapper width
      .call(() => {
        gsap.set(homeRef.current, { visibility: 'hidden' });
        gsap.set(numbersRef.current, { visibility: 'visible' });
      })
      .to(containerRef.current, {
        width: w_nums,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      .to(wrapperRef.current, {
        width: w_nums + 32,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.3')

      // 3. Sweep Right: Reveal numbers
      .to(barRef.current, {
        left: w_nums + 32,
        duration: 0.35,
        ease: 'power2.inOut'
      })
      .to(numbersRef.current, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.35,
        ease: 'power2.inOut'
      }, '-=0.35');
    }

    prevIsPortfolio.current = isPortfolio;

    return () => {
      tl.kill();
    };
  }, [isPortfolio]);

  if (isMobile) {
    const mobileMenuItems = [
      { label: 'home', ariaLabel: 'Go to home page', link: 'home' },
      { label: 'about', ariaLabel: 'Learn about me', link: 'about' },
      { label: 'projects', ariaLabel: 'View my projects', link: 'projects' },
      { label: 'posts', ariaLabel: 'Read my posts', link: 'posts' },
      { label: 'connect', ariaLabel: 'Get in touch', link: 'connect' }
    ];

    const socialItems = [
      { label: 'github', link: 'https://github.com/prathamanvekar' },
      { label: 'linkedin', link: 'https://www.linkedin.com/in/prathamanvekar/' },
      { label: 'twitter', link: 'https://twitter.com/prathamiscool' }
    ];

    return (
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none select-none">
        <StaggeredMenu
          position="right"
          items={mobileMenuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          colors={theme === 'dark' ? ['#2A2533', '#1e1a24'] : ['#e2dbe8', '#f2ecf7']}
          accentColor="var(--color-link)"
          isFixed={true}
          onBack={onBack}
          showBack={['posts', 'post', 'projects', 'project', 'connect'].includes(currentPage)}
          onItemClick={(link) => {
            if (link === 'home') {
              setCurrentPage('portfolio');
              scrollToSection(0);
            } else {
              setCurrentPage(link as NavPage);
            }
          }}
        />

        {/* Floating Theme toggler next to mobile menu button */}
        <div className="absolute top-[1.45em] right-[6rem] pointer-events-auto flex items-center h-[24px]">
          <button 
            onClick={toggleTheme}
            className="hover:text-accent text-muted transition-colors cursor-pointer font-mono text-xs lowercase bg-transparent border-none p-0 outline-none"
          >
            {theme === 'dark' ? 'light' : 'dark'}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center text-text font-mono">
      <div className="flex gap-8 text-xs lowercase items-center">
        {/* Sweep indicators wrapper (unclipped flex-child) */}
        <div 
          ref={wrapperRef}
          className="relative h-5 select-none"
          style={{ width: 136 }} // default fallback (104 + 32)
        >
          {/* Numbers list container (clipped) */}
          <div
            ref={containerRef}
            className="relative h-full overflow-hidden"
            style={{ width: 104 }} // default fallback
          >
            <div
              ref={numbersRef}
              className="absolute left-0 top-0 h-full flex gap-8 items-center"
              style={{ clipPath: 'inset(0 0% 0 0)' }}
            >
              <button 
                onClick={() => scrollToSection(0)} 
                className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${activeIndex === 0 ? 'text-accent active' : 'text-muted hover:text-accent'}`}
              >
                01
              </button>
              <button 
                onClick={() => scrollToSection(1)} 
                className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${activeIndex === 1 ? 'text-accent active' : 'text-muted hover:text-accent'}`}
              >
                02
              </button>
              <button 
                onClick={() => scrollToSection(2)} 
                className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${activeIndex === 2 ? 'text-accent active' : 'text-muted hover:text-accent'}`}
              >
                03
              </button>
            </div>

            {/* Home button container */}
            <button
              ref={homeRef}
              onClick={() => scrollToSection(0)}
              className="absolute left-0 top-0 h-full flex items-center nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono text-muted hover:text-accent"
              style={{ clipPath: 'inset(0 100% 0 0)', visibility: 'hidden' }}
            >
              home
            </button>
          </div>

          {/* The sweeping vertical bar (outside overflow-hidden) */}
          <div 
            ref={barRef} 
            className="absolute w-px h-4 top-1/2 -translate-y-1/2"
            style={{ left: 136, backgroundColor: 'var(--color-text)', opacity: 0.25 }}
          />
        </div>

        <button 
          onClick={() => setCurrentPage('about')}
          className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${currentPage === 'about' ? 'text-accent active' : 'text-muted hover:text-accent'}`}
        >
          about me
        </button>
        <button
          onClick={() => setCurrentPage('projects')}
          className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${currentPage === 'projects' ? 'text-accent active' : 'text-muted hover:text-accent'}`}
        >
          projects
        </button>
        <button
          onClick={() => setCurrentPage('posts')}
          className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${currentPage === 'posts' ? 'text-accent active' : 'text-muted hover:text-accent'}`}
        >
          posts
        </button>
        <button
          onClick={() => setCurrentPage('connect')}
          className={`nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono ${currentPage === 'connect' ? 'text-accent active' : 'text-muted hover:text-accent'}`}
        >
          connect
        </button>

        {/* Separator and Back Button */}
        <AnimatePresence>
          {['posts', 'post', 'projects', 'project', 'connect'].includes(currentPage) && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -10 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -10 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex items-center gap-8 overflow-hidden whitespace-nowrap"
            >
              <span className="text-muted/30">|</span>
              <button
                onClick={onBack}
                className="nav-link cursor-pointer bg-transparent border-none p-0 outline-none font-mono text-muted hover:text-accent"
              >
                ← back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex text-xs lowercase font-mono">
        <button 
          onClick={toggleTheme}
          className="hover:text-accent text-muted transition-colors cursor-pointer font-mono bg-transparent border-none p-0 outline-none"
        >
          {theme === 'dark' ? 'light' : 'dark'}
        </button>
      </div>
      {isPortfolio && (
        <div className="absolute bottom-0 left-0 h-[1.5px] bg-border/20 w-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--color-link)' }}
            animate={{ width: `${(activeIndex / 2) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;

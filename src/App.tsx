import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
import SectionThree from './components/SectionThree';
import CustomCursor from './components/CustomCursor';
import DotGrid from './components/DotGrid';

import AboutMe from './components/AboutMe';
import ProjectPage from './components/ProjectPage';
import ProjectsPage from './components/ProjectsPage';
import PostsPage from './components/PostsPage';
import ConnectPage from './components/ConnectPage';

type Page = 'portfolio' | 'about' | 'projects' | 'posts' | 'connect' | 'project' | 'post';

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`
  ).join(", ");
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: string,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "triangle": {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case "diamond": {
      const R = maxRadius * Math.SQRT2;
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`];
    }
    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(", ");
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case "star": {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
  }
}

const parseUrl = (): { page: Page; project: string | null; post: string | null } => {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (path === '/about') {
    return { page: 'about', project: null, post: null };
  }
  if (path === '/projects') {
    return { page: 'projects', project: null, post: null };
  }
  if (path.startsWith('/projects/')) {
    const slug = path.substring('/projects/'.length);
    return { page: 'project', project: slug || null, post: null };
  }
  if (path === '/posts') {
    return { page: 'posts', project: null, post: null };
  }
  if (path.startsWith('/posts/')) {
    const slug = path.substring('/posts/'.length);
    return { page: 'post', project: null, post: slug || null };
  }
  if (path === '/connect') {
    return { page: 'connect', project: null, post: null };
  }
  return { page: 'portfolio', project: null, post: null };
};

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    return savedTheme || 'dark';
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<Page>(() => parseUrl().page);
  const [currentProject, setCurrentProject] = useState<string | null>(() => parseUrl().project);
  const [currentPost, setCurrentPost] = useState<string | null>(() => parseUrl().post);
  const [navigateSource, setNavigateSource] = useState<'home' | 'projects'>(() => {
    const { page } = parseUrl();
    return page === 'project' ? 'projects' : 'home';
  });
  const [activeLog, setActiveLog] = useState('~ $ whoami');
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const triggerHomeTransition = useCallback((targetIndex: number = 0) => {
    // 1. Reset all scrollable containers in the document to 0 instantly
    document.querySelectorAll('.overflow-y-auto, [class*="overflow-y"]').forEach(el => {
      el.scrollTop = 0;
    });
    window.scrollTo(0, 0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    // 2. Switch page state immediately (no loading screen, no masking)
    setActiveIndex(targetIndex);
    setCurrentPage('portfolio');
    setCurrentProject(null);
    setCurrentPost(null);
  }, []);
  const isAnimating = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    const ua = navigator.userAgent.toLowerCase();
    const isFirefox = ua.includes('firefox');
    const isZen = ua.includes('zen');
    const isMobileAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const shouldDisableTransition = isMobile || isMobileAgent || isFirefox || isZen;

    // Safe fallback / lowkey theme toggle if view transitions are unsupported, disabled, or if event context is missing
    if (
      shouldDisableTransition ||
      typeof document.startViewTransition !== 'function' ||
      !e ||
      !e.currentTarget
    ) {
      setTheme(newTheme);
      setTimeout(() => {
        localStorage.setItem('theme', newTheme);
      }, 0);
      return;
    }

    const button = e.currentTarget as HTMLElement;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const clipPath = getThemeTransitionClipPaths(
      "circle",
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight
    );

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      "400ms"
    );
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

    const cleanup = () => {
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
      setTimeout(() => {
        localStorage.setItem('theme', newTheme);
      }, 0);
    });

    if (transition && typeof transition.finished?.finally === 'function') {
      transition.finished.finally(cleanup);
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === 'function') {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 400,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    }
  };

  // Sync default status log with page transitions
  useEffect(() => {
    if (currentPage === 'portfolio') {
      setActiveLog(`~ $ cd sections/0${activeIndex + 1}`);
    } else if (currentPage === 'about') {
      setActiveLog('~ $ cat info/about.md');
    } else if (currentPage === 'projects') {
      setActiveLog('~ $ ls -la work/projects/');
    } else if (currentPage === 'posts') {
      setActiveLog('~ $ tail -n 10 logs/posts.log');
    } else if (currentPage === 'post') {
      setActiveLog(`~ $ cat logs/posts/${currentPost}`);
    } else if (currentPage === 'connect') {
      setActiveLog('~ $ ping -c 4 social.networks');
    } else if (currentPage === 'project') {
      setActiveLog(`~ $ cat projects/${currentProject}`);
    }
  }, [currentPage, activeIndex, currentProject, currentPost]);

  // Stable helper to restore the default status log for the current page
  const restoreDefaultLog = useCallback(() => {
    if (currentPage === 'portfolio') {
      setActiveLog(`~ $ cd sections/0${activeIndex + 1}`);
    } else if (currentPage === 'about') {
      setActiveLog('~ $ cat info/about.md');
    } else if (currentPage === 'projects') {
      setActiveLog('~ $ ls -la work/projects/');
    } else if (currentPage === 'posts') {
      setActiveLog('~ $ tail -n 10 logs/posts.log');
    } else if (currentPage === 'post') {
      setActiveLog(`~ $ cat logs/posts/${currentPost}`);
    } else if (currentPage === 'connect') {
      setActiveLog('~ $ ping -c 4 social.networks');
    } else if (currentPage === 'project') {
      setActiveLog(`~ $ cat projects/${currentProject}`);
    }
  }, [currentPage, activeIndex, currentProject, currentPost]);

  // Command-Line Feed hover hook
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const dataLog = target.closest('[data-log]')?.getAttribute('data-log');
      if (dataLog) {
        setActiveLog(`~ $ ${dataLog}`);
        return;
      }

      // Check search input in projects page
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).placeholder?.includes('search')) {
        const val = (target as HTMLInputElement).value;
        setActiveLog(`~ $ grep -ri "${val}"`);
        return;
      }

      const interactive = target.closest('.nav-link, button, a');
      if (interactive) {
        const text = interactive.textContent?.trim().toLowerCase() || '';
        const href = (interactive as HTMLAnchorElement).href || '';

        if (text === 'back') {
          setActiveLog('~ $ cd ..');
          return;
        }

        if (text === 'light' || text === 'dark') {
          setActiveLog(`~ $ systemctl set-theme ${text === 'light' ? 'dark' : 'light'}`);
          return;
        }

        // Check filter chips inside projects page
        const isFilterButton = interactive.tagName === 'BUTTON' && currentPage === 'projects';
        if (isFilterButton) {
          if (text === 'all') {
            setActiveLog('~ $ find work/projects -type f');
          } else if (text === 'go') {
            setActiveLog('~ $ find work/projects -name "*.go"');
          } else if (text === 'python') {
            setActiveLog('~ $ find work/projects -name "*.py"');
          } else if (text === 'c/c++' || text === 'c++') {
            setActiveLog('~ $ find work/projects -name "*.cpp"');
          } else {
            setActiveLog(`~ $ find work/projects -tags "${text}"`);
          }
          return;
        }

        if (text === 'about me') {
          setActiveLog('~ $ cat info/about.md');
          return;
        }
        if (text === 'projects') {
          setActiveLog('~ $ ls -la work/projects/');
          return;
        }
        if (text === 'posts') {
          setActiveLog('~ $ tail -n 10 logs/posts.log');
          return;
        }
        if (text === 'connect') {
          setActiveLog('~ $ ping -c 4 social.networks');
          return;
        }
        if (text === 'home' || text === '01') {
          setActiveLog('~ $ cd sections/01');
          return;
        }
        if (text === '02') {
          setActiveLog('~ $ cd sections/02');
          return;
        }
        if (text === '03') {
          setActiveLog('~ $ cd sections/03');
          return;
        }

        if (href.includes('github.com')) {
          setActiveLog('~ $ ssh -T git@github.com');
          return;
        }
        if (href.includes('linkedin.com')) {
          setActiveLog('~ $ curl -I linkedin.com/in/pratham');
          return;
        }
        if (href.includes('mailto:') || text.includes('email')) {
          setActiveLog('~ $ sendmail anvekarprathamesh13@gmail.com');
          return;
        }
        if (href.includes('twitter.com') || href.includes('x.com')) {
          setActiveLog('~ $ curl -X GET twitter.com/prathamiscool');
          return;
        }
        if (href.includes('reddit.com')) {
          setActiveLog('~ $ GET reddit.com/user/prathamanvekar');
          return;
        }
        if (href.includes('instagram.com')) {
          setActiveLog('~ $ curl -I instagram.com/prathamanvekar');
          return;
        }
        if (href.includes('boot.dev')) {
          setActiveLog('~ $ bootdev run main.py');
          return;
        }
        if (href.includes('leetcode.com')) {
          setActiveLog('~ $ leetcode submit solution.cpp');
          return;
        }
        if (href.includes('codeforces.com')) {
          setActiveLog('~ $ codeforces test solution.cpp');
          return;
        }
        if (href.includes('codechef.com')) {
          setActiveLog('~ $ chef-client submit problem.go');
          return;
        }

        if (text.includes('pune') || href.includes('share.google')) {
          setActiveLog('~ $ curl ipinfo.io/pune');
          return;
        }

        if (text === 'ergen' || href.includes('ergen')) {
          setActiveLog('~ $ cat projects/ergen.go');
          return;
        }
        if (text === 'ebfer' || href.includes('ebfer')) {
          setActiveLog('~ $ cat projects/ebfer.c');
          return;
        }
        if (text === 'proxie' || href.includes('proxie')) {
          setActiveLog('~ $ cat projects/proxie.py');
          return;
        }
        if (text === 'qupload' || href.includes('video-app')) {
          setActiveLog('~ $ cat projects/qupload.tsx');
          return;
        }
        if (text === 'gator' || href.includes('gator')) {
          setActiveLog('~ $ cat projects/gator.go');
          return;
        }
        if (text === 'sentinel' || href.includes('jobs-alert-cli')) {
          setActiveLog('~ $ cat projects/sentinel.go');
          return;
        }
        if (text === 'yield' || href.includes('agri-insurance-dapp-blockchain')) {
          setActiveLog('~ $ cat projects/yield.sol');
          return;
        }
        if (text === 'cybully' || href.includes('cyberbul-realtime-ai')) {
          setActiveLog('~ $ cat projects/cybully.py');
          return;
        }
        if (text === 'sentry' || href.includes('cyber-threat-intelligence-detection-system-ids')) {
          setActiveLog('~ $ cat projects/sentry.py');
          return;
        }
        if (text === 'prismo' || href.includes('ai-medical-vision-bot')) {
          setActiveLog('~ $ cat projects/prismo.py');
          return;
        }
        if (text === 'gaze' || href.includes('image-personalizer')) {
          setActiveLog('~ $ cat projects/gaze.py');
          return;
        }
        if (text === 'rssgen' || href.includes('static-site-gen')) {
          setActiveLog('~ $ cat projects/rssgen.py');
          return;
        }
      } else {
        restoreDefaultLog();
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      if (target && target.tagName === 'INPUT' && target.placeholder?.includes('search')) {
        setActiveLog(`~ $ grep -ri "${target.value}"`);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('input', handleInput);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('input', handleInput);
    };
  }, [currentPage, activeIndex, currentProject, restoreDefaultLog]);

  const transitionTo = (nextIndex: number) => {
    if (isMobile || nextIndex < 0 || nextIndex >= 3 || isAnimating.current) return;
    isAnimating.current = true;
    setActiveIndex(nextIndex);

    gsap.to(sectionsRef.current, {
      xPercent: -100 * nextIndex / 3,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  };

  useEffect(() => {
    if (loading || !mainContentRef.current) return;
    gsap.fromTo(mainContentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.inOut' }
    );
  }, [loading]);

  // Synchronize layout position and window scroll when the portfolio page is mounted
  const prevPageRef = useRef<Page | null>(null);

  useEffect(() => {
    const enteringPortfolio = currentPage === 'portfolio' && prevPageRef.current !== 'portfolio';
    prevPageRef.current = currentPage;

    if (currentPage !== 'portfolio' || !sectionsRef.current) return;

    if (!isMobile) {
      // Desktop: keep the horizontal track synced to activeIndex (nav clicks, page entry, etc.)
      gsap.set(sectionsRef.current, {
        xPercent: -100 * activeIndex / 3
      });
    }

    // Mobile/tablet: only force-jump on fresh entry into the portfolio page.
    // Skip this on plain activeIndex updates caused by the scroll-tracking
    // ScrollTrigger below, otherwise every natural scroll gets yanked back
    // to a section top, feeling like scroll-snapping.
    if (!enteringPortfolio) return;

    window.scrollTo(0, 0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    if (isMobile) {
      const sections = Array.from(sectionsRef.current.children) as HTMLElement[];
      if (sections && sections[activeIndex]) {
        sections[activeIndex].scrollIntoView({ block: 'start' });
      }
    }
  }, [currentPage, activeIndex, isMobile]);

  // Listen to popstate event (browser back/forward button clicks)
  useEffect(() => {
    const handlePopState = () => {
      const { page, project, post } = parseUrl();
      if (page === 'portfolio') {
        triggerHomeTransition(0);
      } else {
        setCurrentPage(page);
        setCurrentProject(project);
        setCurrentPost(post);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [triggerHomeTransition]);

  // Synchronize state changes with URL history
  useEffect(() => {
    let expectedPath = '/';
    if (currentPage === 'about') expectedPath = '/about';
    else if (currentPage === 'projects') expectedPath = '/projects';
    else if (currentPage === 'posts') expectedPath = '/posts';
    else if (currentPage === 'connect') expectedPath = '/connect';
    else if (currentPage === 'project' && currentProject) expectedPath = `/projects/${currentProject}`;
    else if (currentPage === 'post' && currentPost) expectedPath = `/posts/${currentPost}`;

    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const normalizedExpected = expectedPath.toLowerCase().replace(/\/$/, '');

    if (currentPath !== normalizedExpected) {
      window.history.pushState({ page: currentPage, project: currentProject, post: currentPost }, '', expectedPath);
    }
  }, [currentPage, currentProject, currentPost]);

  // GSAP ScrollTrigger to update active index based on vertical scroll on mobile/tablets
  useEffect(() => {
    if (!isMobile || loading || currentPage !== 'portfolio' || !sectionsRef.current) return;

    const sections = Array.from(sectionsRef.current.children) as HTMLElement[];
    const triggers: any[] = [];

    sections.forEach((sec, idx) => {
      const trigger = ScrollTrigger.create({
        trigger: sec,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveIndex(idx);
          }
        }
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [isMobile, loading, currentPage]);

  // Horizontal scroll only active on portfolio page for desktop/laptops
  useEffect(() => {
    if (loading || currentPage !== 'portfolio' || isMobile) return;

    let touchStartY = 0;
    let touchStartX = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;

      let deltaX = e.deltaX;
      let deltaY = e.deltaY;

      // Normalize Firefox/Gecko line-unit delta values (e.deltaMode === 1)
      if (e.deltaMode === 1) { // WheelEvent.DOM_DELTA_LINE
        deltaX *= 40;
        deltaY *= 40;
      } else if (e.deltaMode === 2) { // WheelEvent.DOM_DELTA_PAGE
        deltaX *= 800;
        deltaY *= 800;
      }

      const magnitude = Math.max(Math.abs(deltaY), Math.abs(deltaX));
      if (magnitude < 30) return;
      if (deltaY > 0 || deltaX > 0) transitionTo(activeIndex + 1);
      else transitionTo(activeIndex - 1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      const diffX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffY) > 50 || Math.abs(diffX) > 50) {
        if (diffY > 0 || diffX > 0) transitionTo(activeIndex + 1);
        else transitionTo(activeIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loading, activeIndex, currentPage, isMobile]);

  const performScroll = (index: number) => {
    if (isMobile) {
      const sections = sectionsRef.current?.children;
      if (sections && sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveIndex(index);
      }
    } else {
      transitionTo(index);
    }
  };

  const scrollToSection = (index: number) => {
    if (currentPage !== 'portfolio') {
      triggerHomeTransition(index);
    } else {
      performScroll(index);
    }
  };

  const navigateToProject = (slug: string, source: 'home' | 'projects') => {
    setCurrentProject(slug);
    setNavigateSource(source);
    setCurrentPage('project');
  };

  const navigateBack = () => {
    if (navigateSource === 'projects') {
      setCurrentPage('projects');
      setCurrentProject(null);
    } else {
      triggerHomeTransition(0);
    }
  };

  const handleBackToHome = () => {
    triggerHomeTransition(0);
  };

  const handleSetPage = (page: Page) => {
    if (page === 'portfolio') {
      triggerHomeTransition(0);
    } else {
      window.scrollTo(0, 0);
      setCurrentPage(page);
      if (page !== 'project') setCurrentProject(null);
      if (page !== 'post') setCurrentPost(null);
    }
  };

  const pageKey = currentPage === 'project' ? `project-${currentProject}` : currentPage;

  return (
    <div className="bg-bg text-text min-h-screen overflow-hidden font-mono selection:bg-accent selection:text-bg relative z-0">
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden select-none">
        <DotGrid
          dotSize={2.5}
          gap={26}
          baseColor={theme === 'dark' ? '#2f273f' : '#e2dbe8'}
          activeColor={theme === 'dark' ? '#bd93f9' : '#7c3aed'}
          proximity={120}
        />
      </div>
      <CustomCursor />
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center bg-transparent">
          <Loader />
        </div>
      ) : (
        <div ref={mainContentRef} className="opacity-0">
          <Navbar
            scrollToSection={scrollToSection}
            theme={theme}
            toggleTheme={toggleTheme}
            activeIndex={activeIndex}
            currentPage={currentPage}
            setCurrentPage={handleSetPage}
            onBack={() => {
              if (currentPage === 'post') {
                setCurrentPost(null);
                setCurrentPage('posts');
              } else if (currentPage === 'project') {
                navigateBack();
              } else if (currentPage === 'posts' || currentPage === 'projects' || currentPage === 'connect') {
                handleBackToHome();
              }
            }}
          />
          <LayoutGroup>
            <AnimatePresence mode="popLayout" initial={false}>
              {currentPage === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="w-full h-full"
                >
                  <AboutMe onBack={handleBackToHome} theme={theme} />
                </motion.div>
              )}
              {currentPage === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="w-full h-full"
                >
                  <ProjectsPage
                    onNavigateProject={(slug) => navigateToProject(slug, 'projects')}
                  />
                </motion.div>
              )}
              {(currentPage === 'posts' || currentPage === 'post') && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="w-full h-full"
                >
                  <PostsPage
                    currentPostSlug={currentPost}
                    onNavigatePost={(slug) => {
                      setCurrentPost(slug);
                      setCurrentPage(slug ? 'post' : 'posts');
                    }}
                  />
                </motion.div>
              )}
              {currentPage === 'connect' && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="w-full h-full"
                >
                  <ConnectPage />
                </motion.div>
              )}
              {currentPage === 'project' && currentProject && (
                <motion.div
                  key={pageKey}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="w-full h-full"
                >
                  <ProjectPage
                    slug={currentProject}
                    layoutSource={navigateSource}
                    onBack={navigateBack}
                  />
                </motion.div>
              )}
              {currentPage === 'portfolio' && (
                <motion.div
                  layoutScroll
                  key="portfolio"
                  ref={containerRef}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  className="w-full lg:w-screen h-auto lg:h-screen overflow-y-auto lg:overflow-hidden"
                >
                  <div ref={sectionsRef} className="flex flex-col lg:flex-row w-full lg:w-[300vw] h-auto lg:h-full">
                    <SectionOne onNavigateProject={(slug) => navigateToProject(slug, 'home')} />
                    <SectionTwo />
                    <SectionThree />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
          {/* Command-Line Status Bar Ticker */}
          {currentPage !== 'project' && currentPage !== 'projects' && (
            <div className="hidden md:block fixed bottom-3 right-6 md:right-12 lg:right-20 z-[999] pointer-events-none select-none text-[10px] font-mono text-muted/40 transition-colors duration-300 lowercase">
              {activeLog}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
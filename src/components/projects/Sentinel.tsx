import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import DrawingLine from '../DrawingLine';

interface ProjectComponentProps {
  layoutSource: 'home' | 'projects';}

const Sentinel = ({ layoutSource }: ProjectComponentProps) => {
  const titleLayoutId = `${layoutSource === 'home' ? 'home' : 'list'}-title-sentinel`;

  return (
    <motion.section
      key="project-sentinel"
      layoutScroll
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-20 lg:pt-24 pb-12 lg:pb-8 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      <div className="w-full max-w-[76rem] h-auto lg:max-h-[85vh] lg:overflow-y-auto lg:no-scrollbar pt-8 lg:pt-0 pb-24 lg:pb-20">

        
        {/* Project header */}
        <div className="pb-6 mb-8 relative">
          <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/30" delay={0.3} />
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
            <motion.h1
              layoutId={titleLayoutId}
              layout="position"
              className="text-2xl md:text-3xl font-bold lowercase text-text font-mono"
              transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
            >
              sentinel
            </motion.h1>
            <span className="text-xs text-muted font-mono">go / 2026</span>
          </div>

          {/* Repo link */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <a
              href="https://github.com/prathamanvekar/jobs-alert-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap border border-border/30 hover:border-accent/60 text-muted hover:text-accent transition-all duration-200 font-mono text-[11px] px-3 py-1.5 rounded-sm group"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>prathamanvekar/jobs-alert-cli</span>
              <ExternalLink size={10} className="opacity-40 group-hover:opacity-80 transition-opacity flex-shrink-0" />
            </a>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="text-sm md:text-base text-text font-mono lowercase leading-relaxed mb-8"
        >
          a terminal-based go application to track, retrieve, and alert users of new jobs.
        </motion.p>

        {/* Description paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          className="space-y-5 font-mono text-xs md:text-sm text-muted leading-relaxed"
        >
          <p>developed a terminal-based go application with secure authentication to seamlessly track, retrieve, and alert users of new job postings directly from the command line.</p>
          <p>it features secure authentication to persist user preferences and uses cron-like scheduling for background retrieval directly from the terminal.</p>
          <p>designed with efficiency in mind, sentinel runs headlessly and delivers formatted alerts to standard output or notifications without hogging system resources.</p>
        </motion.div>

        {/* Runtime workflow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38 }}
          className="mt-8 border border-border/20 rounded-md bg-bg/50 overflow-hidden font-mono text-xs md:text-sm"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/10 bg-border/5">
            <span className="text-[10px] text-muted tracking-wider uppercase font-semibold">alert system workflow</span>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
            </div>
          </div>
          <div className="p-5 md:p-6 text-muted/95 font-mono select-none overflow-x-auto">
            <div className="flex flex-col gap-4 max-w-3xl min-w-[580px]">
              
              {/* Step 1: Input */}
              <div className="flex flex-row flex-nowrap items-center gap-2 md:gap-3 whitespace-nowrap">
                <div className="px-2.5 py-1.5 rounded border border-border/40 bg-white/[0.01] text-text font-medium">
                  [job sources]
                </div>
              </div>

              {/* Downward Flow Connector */}
              <div className="flex items-center pl-6 text-muted/30 gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-[10px] text-muted/40 uppercase tracking-widest font-semibold">aggregation phase</span>
              </div>

              {/* Step 2: Scrape & Auth */}
              <div className="flex flex-row flex-nowrap items-center gap-2 md:gap-3 whitespace-nowrap">
                <div className="px-2.5 py-1.5 rounded border border-accent/30 bg-accent/5 text-accent font-semibold">
                  [cli scraper]
                </div>
                <span className="text-muted/30 font-light">→</span>
                <div className="px-2.5 py-1.5 rounded border border-border/30 bg-white/[0.01] text-muted/60">
                  [auth check]
                </div>
              </div>

              {/* Downward Flow Connector */}
              <div className="flex items-center pl-6 text-muted/30 gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-[10px] text-muted/40 uppercase tracking-widest font-semibold">alert dispatch</span>
              </div>

              {/* Step 3: Alerts */}
              <div className="flex flex-row flex-nowrap items-center gap-2 md:gap-3 whitespace-nowrap">
                <div className="px-2.5 py-1.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold shadow-sm shadow-emerald-500/5">
                  [stdout / email alerts]
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Sentinel;

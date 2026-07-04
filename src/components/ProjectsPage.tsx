import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import DrawingLine from './DrawingLine';

export interface Project {
  slug: string;
  name: string;
  tech: string;
  year: string;
  githubUrl: string;
  tagline: string;
  description: string[];
  tags: string[];
}

const projects: Project[] = [
  {
    slug: 'ergen',
    name: 'ergen',
    tech: 'go',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/ergen',
    tagline: 'an ast driven local first tool for automating go\'s repetitive error handling.',
    description: [
      'ergen is a code generation tool that parses go source files using the go/ast package to identify functions that return errors, then automatically scaffolds idiomatic error handling boilerplate inline.',
      'it supports custom error templates on a per-project basis, letting teams define their own error wrapping conventions — useful for systems that need consistent context propagation or specific logging patterns at every call site.',
      'the tool runs entirely locally with no external dependencies, making it safe to integrate into any ci pipeline or pre-commit hook without network access.',
    ],
    tags: ['go', 'system'],
  },
  {
    slug: 'ebfer',
    name: 'ebfer',
    tech: 'c / seccomp-bpf',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/kernel-sandbox',
    tagline: 'a policy-driven c sandboxing engine using seccomp-bpf filters.',
    description: [
      'ebfer is a kernel-level sandboxing engine written in c that uses seccomp-bpf (berkeley packet filter) to restrict the system calls a process is allowed to make at runtime.',
      'policies are defined declaratively and compiled to bpf bytecode, then attached to child processes via fork/exec. any syscall outside the allowlist is blocked by the kernel before it executes, eliminating a full class of privilege escalation and container escape attacks.',
      'runtime violations are logged with full context — pid, syscall number, arguments — making forensic analysis straightforward without needing kernel modules or elevated privileges on the host.',
    ],
    tags: ['c/c++', 'system'],
  },
  {
    slug: 'proxie',
    name: 'proxie',
    tech: 'python / gemma / react',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/secure-llm-proxy',
    tagline: 'a security-first gateway that secures ai workflows and local quantized gemma 3 inference.',
    description: [
      'proxie is a reverse proxy layer that sits between client applications and a locally hosted gemma 3 model, adding a threat detection pipeline before any prompt reaches the llm.',
      'incoming requests are scanned for pii (names, emails, card numbers) using regex and ner models, checked against a prompt injection signature database, and flagged for anomalous intent patterns. requests that trip any threshold are blocked and logged before inference begins.',
      'the system exposes a react dashboard for monitoring flagged requests, reviewing telemetry, and adjusting detection sensitivity in real time — making it practical for teams evaluating local ai deployments in regulated environments.',
    ],
    tags: ['python', 'ai/ml', 'fullstack'],
  },
  {
    slug: 'qupload',
    name: 'qupload',
    tech: 'next.js / mongodb / nextauth / imagekit',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/video-app',
    tagline: 'a responsive next.js video hosting and streaming platform.',
    description: [
      'developed a responsive next.js and mongodb video hosting platform featuring nextauth authentication and a seamless background video upload pipeline directly to imagekit on file selection.',
      'the platform leverages imagekit\'s video optimization APIs to deliver adaptive streaming, and implements nextauth for secure user authentication.',
      'optimized upload speeds are achieved by bypassing the main server, allowing direct client-to-cloud uploads with secure ephemeral tokens.',
    ],
    tags: ['fullstack', 'system'],
  },
  {
    slug: 'gator',
    name: 'gator',
    tech: 'go / postgresql / sqlc',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/gator',
    tagline: 'a concurrent command-line rss feed aggregator.',
    description: [
      'built a concurrent command-line rss feed aggregator to fetch and parse xml feeds, managing user subscriptions and utilizing sqlc for type-safe go and postgresql database queries.',
      'it implements concurrency patterns in go to process multiple feeds simultaneously, using postgresql for storing feeds, users, and subscriptions.',
      'using sqlc, the project generates type-safe database queries, guaranteeing compile-time validation for all relational operations.',
    ],
    tags: ['go', 'backend', 'system'],
  },
  {
    slug: 'sentinel',
    name: 'sentinel',
    tech: 'go',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/jobs-alert-cli',
    tagline: 'a terminal-based go application to track, retrieve, and alert users of new jobs.',
    description: [
      'developed a terminal-based go application with secure authentication to seamlessly track, retrieve, and alert users of new job postings directly from the command line.',
      'it features secure authentication to persist user preferences and uses cron-like scheduling for background retrieval directly from the terminal.',
      'designed with efficiency in mind, sentinel runs headlessly and delivers formatted alerts to standard output or notifications without hogging system resources.',
    ],
    tags: ['go', 'backend', 'system'],
  },
  {
    slug: 'yield',
    name: 'yield',
    tech: 'solidity / python / scikit-learn / javascript',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/agri-insurance-dapp-blockchain',
    tagline: 'a decentralized crop insurance platform with machine learning risk assessment.',
    description: [
      'architected a decentralized crop insurance platform integrating solidity smart contracts with a python backend, utilizing random forest and xgboost models to assess weather risks and automate claim settlements.',
      'the system integrates a solidity smart contract with a python backend containing random forest and xgboost machine learning models.',
      'by analyzing historical and real-time weather data, the predictive models estimate agricultural risk, while the smart contracts automatically execute claim payments upon triggering predefined weather events.',
    ],
    tags: ['blockchain', 'python', 'ai/ml'],
  },
  {
    slug: 'cybully',
    name: 'cybully',
    tech: 'python / flask / javascript / sqlite',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/cyberbul-realtime-ai',
    tagline: 'a real-time chat application with machine learning toxicity filtering.',
    description: [
      'engineered a real-time chat application incorporating a custom decision engine to instantly monitor, classify, and filter toxic messages using machine learning.',
      'the backend is powered by flask and sqlite, integrating natural language processing models to classify messages as cyberbullying or clean on-the-fly.',
      'when a toxic message is detected, cybully\'s decision engine immediately flags and silences the content before it is broadcast to other participants in the chat.',
    ],
    tags: ['python', 'ai/ml', 'fullstack'],
  },
  {
    slug: 'sentry',
    name: 'sentry',
    tech: 'python / machine learning / sqlite',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/cyber-threat-intelligence-detection-system-ids',
    tagline: 'an intrusion detection system leveraging isolation forest and voting classifier models.',
    description: [
      'built an intrusion detection system leveraging isolation forest and voting classifier ensemble models to identify network anomalies and classify cyber threats.',
      'it leverages an ensemble of isolation forest and voting classifier models to analyze network traffic patterns and flag suspicious activities.',
      'the system logs telemetry to a local sqlite database, enabling security analysts to query intrusion logs and adapt classification thresholds.',
    ],
    tags: ['python', 'ai/ml', 'system'],
  },
  {
    slug: 'prismo',
    name: 'prismo',
    tech: 'python / gradio / vision ai / elevenlabs',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/ai-medical-vision-bot',
    tagline: 'a multimodal ai medical chatbot for voice-activated image diagnosis.',
    description: [
      'developed a multimodal ai medical chatbot that analyzes patient medical images and responds to real-time voice queries using elevenlabs audio synthesis and a gradio interface.',
      'the app integrates state-of-the-art vision-language models with elevenlabs text-to-speech audio synthesis inside a clean gradio interface.',
      'users can upload medical imagery like x-rays, ask questions vocally, and receive spoken, clinically detailed responses instantly.',
    ],
    tags: ['python', 'ai/ml'],
  },
  {
    slug: 'gaze',
    name: 'gaze',
    tech: 'python / opencv / haar cascades / lbph',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/image-personalizer',
    tagline: 'a webcam-validated facial recognition system with automated dataset management.',
    description: [
      'built a webcam-validated python and opencv facial recognition system featuring automated dataset management, image preprocessing, and time-stamped training versioning using haar cascades and lbph.',
      'it implements haar cascade classifiers for robust face localization and local binary patterns histograms (lbph) for face identification.',
      'the system features automated dataset management, taking snapshots from webcams to dynamically preprocess and retrain models with time-stamped version control.',
    ],
    tags: ['python', 'ai/ml'],
  },
  {
    slug: 'rssgen',
    name: 'rssgen',
    tech: 'python / markdown / html',
    year: '2026',
    githubUrl: 'https://github.com/prathamanvekar/static-site-gen',
    tagline: 'a custom markdown-to-html conversion engine for generating static websites.',
    description: [
      'developed a custom markdown-to-html conversion engine that parses inline and block markdown nodes to automatically generate fully formatted static websites.',
      'it features a custom parser that reads and tokenizes inline markdown elements (bold, italic, links) and block nodes (headings, code blocks, paragraphs).',
      'the engine compiles pages using static templates, enabling fast, dependency-free deployment of developer portfolios and blogs.',
    ],
    tags: ['python', 'system'],
  },
];

// Collect unique tags from all projects
const allTags = ['all', ...Array.from(new Set(
  projects.flatMap(p => p.tags)
))];

interface ProjectsPageProps {
  onNavigateProject: (slug: string) => void;
}

const ProjectsPage = ({ onNavigateProject }: ProjectsPageProps) => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [isInitial, setIsInitial] = useState(true);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setIsInitial(false);
  };

  const handleTagChange = (val: string) => {
    setActiveTag(val);
    setIsInitial(false);
  };

  const filtered = useMemo(() => {
    const lowercaseQuery = query.toLowerCase().trim();
    return projects.filter(p => {
      const matchesTag =
        activeTag === 'all' ||
        p.tags.includes(activeTag);

      if (!matchesTag) return false;

      if (lowercaseQuery === '') return true;

      return (
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.tagline.toLowerCase().includes(lowercaseQuery) ||
        p.tech.toLowerCase().includes(lowercaseQuery) ||
        p.tags.some(t => t.toLowerCase().includes(lowercaseQuery)) ||
        p.githubUrl.toLowerCase().includes(lowercaseQuery) ||
        p.description.some(d => d.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [query, activeTag]);

  return (
    <motion.section
      key="projects-page"
      layoutScroll
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-start justify-center px-6 md:px-12 lg:px-20 pt-20 lg:pt-24 pb-12 lg:pb-8 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      <div className="w-full max-w-[76rem] h-auto lg:h-full lg:overflow-y-auto lg:no-scrollbar pt-8 lg:pt-0">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 pt-10"
        >
          <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
            projects
            <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.2} />
          </div>
        </motion.div>

        {/* Search + filter row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="flex flex-col md:flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 mb-8 w-full"
        >
          {/* Search bar */}
          <div className="relative w-full max-w-sm md:max-w-md lg:max-w-sm">
            <Search
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="search projects..."
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              className="w-full pl-8 pr-4 py-2 md:py-2.5 bg-transparent border border-border/25 hover:border-border/50 focus:border-accent/60 focus:outline-none rounded-sm font-mono text-xs text-text placeholder:text-muted/50 transition-all duration-200 focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Tech filter chips */}
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`font-mono text-[11px] px-3 py-1.5 md:px-4 md:py-2 rounded-sm border transition-all duration-200 cursor-pointer outline-none ${activeTag === tag
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border/25 text-muted hover:border-border/50 hover:text-text bg-transparent'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project list */}
        <div className="space-y-0 relative min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p
                key="no-projects-msg"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted font-mono py-8"
              >
                no projects match your search.
              </motion.p>
            ) : (
              filtered.map((project, i) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={isInitial ? { opacity: 0, y: 10 } : { opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5, height: 0, overflow: 'hidden', padding: 0 }}
                  transition={{
                    layout: { type: 'spring', stiffness: 450, damping: 40 },
                    opacity: { duration: isInitial ? 0.35 : 0.15 },
                    y: { duration: isInitial ? 0.35 : 0.15 },
                    height: { duration: 0.18 },
                    delay: isInitial ? 0.12 + i * 0.06 : 0
                  }}
                  className="group py-5 relative block"
                >
                  {i === 0 && (
                    <DrawingLine
                      direction="horizontal"
                      className="top-0 left-0 text-border/20"
                      animate={isInitial}
                      delay={0.12 + i * 0.06}
                      duration={0.8}
                    />
                  )}

                  <div className="flex justify-between items-baseline mb-2">
                    {/* Title — shared element transition matches SectionOne + ProjectPage */}
                    <button
                      onClick={() => onNavigateProject(project.slug)}
                      className="bg-transparent border-none p-0 outline-none cursor-pointer text-left"
                    >
                      <motion.h2
                        layoutId={`list-title-${project.slug}`}
                        layout="position"
                        className="font-bold text-sm md:text-base text-text font-mono underlined-link group-hover:text-accent transition-colors duration-200"
                        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                      >
                        {project.name}
                      </motion.h2>
                    </button>
                    <span className="text-[11px] text-muted font-mono flex-shrink-0 ml-4">
                      {project.tech} / {project.year}
                    </span>
                  </div>
                  <p className="text-xs text-muted font-mono leading-relaxed">
                    {project.tagline}
                  </p>

                  <DrawingLine
                    direction="horizontal"
                    className="bottom-0 left-0 text-border/20"
                    animate={isInitial}
                    delay={0.12 + (i + 1) * 0.06}
                    duration={0.8}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.section>
  );
};

export default ProjectsPage;


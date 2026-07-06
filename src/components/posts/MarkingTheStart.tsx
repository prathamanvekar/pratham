import { motion } from 'framer-motion';
import { Tag, Coffee } from 'lucide-react';

const MarkingTheStartPost = () => {
  return (
    <motion.section
      key="post-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-start justify-center px-6 md:px-12 lg:px-20 pt-14 lg:pt-18 pb-12 lg:pb-8 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      <div className="w-full max-w-[48rem] h-auto lg:h-full lg:overflow-y-auto lg:no-scrollbar pt-4 pb-24 lg:pb-20">

        {/* Header as a terminal window, replacing the old hero image */}
        <div className="rounded-lg border border-border/15 overflow-hidden mb-8">
          <div className="flex items-center gap-2 pl-4 pr-4 py-2 border-b border-border/10">
            <span className="pulse-dot" />
            <span className="text-[10px] text-muted/50 font-mono lowercase">~/posts/marking-the-start.md</span>
          </div>
          <div className="px-5 py-7 md:px-8 md:py-9">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted uppercase tracking-wider mb-4">
              <span className="flex items-center gap-1.5 border border-border/25 rounded-sm px-2 py-0.5">
                <Tag size={10} className="text-accent" />
                Life
              </span>
              <span>July 3, 2026</span>
              <span className="text-muted/40">·</span>
              <span>2 min read</span>
            </div>

            <motion.h1
              layoutId="post-title-marking-the-start"
              className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-text leading-tight tracking-tight"
            >
              Marking the Start
            </motion.h1>
          </div>
        </div>

        {/* Content rendering */}
        <div className="blog-content mb-16 max-w-none">
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">Hey.</p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">I guess this officially marks the start of me writing stuff here.</p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            I'm hoping to put out one or two posts every month about things I've explored, built, broken, or just found interesting. Mostly <strong className="text-accent font-bold">Go and its ecosystem</strong>, <strong className="text-accent font-bold">backend tooling and concepts</strong>, <strong className="text-accent font-bold">AI</strong>, <strong className="text-accent font-bold">LLMs</strong>, <strong className="text-accent font-bold">agentic stuff</strong>, and whatever else I end up obsessing over for a while.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            And occasionally, some life lessons if I feel like <strong className="text-accent font-bold">Plato</strong>.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">I still have no idea what my writing style is gonna end up looking like, or if any of this will be useful to anyone. Those thoughts are probably always gonna be there.</p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">But that's not really why I'm doing this.</p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">I like learning things, going a little too deep into them, and sharing what I find along the way. If someone else gets something out of it, that's awesome. If not, at least I'll have a nice archive of things I once cared enough about to write down.</p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">If you end up reading a post and have something to say — whether it's feedback, a correction, or just "this was cool" — I'd genuinely love to hear it.</p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            And if you somehow end up liking both the posts and me, you can always fund my <strong className="text-accent font-bold">fries and hot chocolate addiction</strong> 😋 <strong className="text-accent font-bold">Kofi</strong> coming soon.
          </p>
        </div>

        {/* Kofi / Support Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/15 mb-12 text-xs font-mono text-muted/60">
          <div className="flex items-center gap-2">
            <Coffee size={13} className="text-accent animate-pulse" />
            <span>fries & hot chocolate support coming soon.</span>
          </div>
          <span className="text-[10px] text-muted/30 uppercase tracking-widest">
            ko-fi pending
          </span>
        </div>

      </div>
    </motion.section>
  );
};

export default MarkingTheStartPost;

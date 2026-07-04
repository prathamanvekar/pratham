import { motion } from 'framer-motion';
import { Tag, Calendar, Clock, Coffee } from 'lucide-react';
import hiImg from '../../assets/hi.jpg';

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

        {/* Meta Info at the top */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted mb-4 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 border border-border/30 rounded px-2 py-0.5 text-[10px]">
            <Tag size={10} className="text-accent" />
            Life
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            July 3, 2026
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            2 min read
          </span>
        </div>

        {/* Hero cover image scaled down (unconstrained borderless motion element) */}
        <motion.img
          layoutId="post-image-marking-the-start"
          src={hiImg}
          alt="Marking the Start"
          className="w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.5/1] rounded-2xl object-cover mb-6"
        />

        {/* Title below image */}
        <motion.h1
          layoutId="post-title-marking-the-start"
          className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-text mb-6 leading-tight tracking-tight"
        >
          Marking the Start
        </motion.h1>

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

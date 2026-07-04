import { useState } from 'react';
import { motion } from 'framer-motion';
import DrawingLine from './DrawingLine';

// Import images directly
import hiImg from '../assets/hi.jpg';
import sslVsTlsImg from '../assets/ssl vs tls.jpg';

// Import post components
import MarkingTheStartPost from './posts/MarkingTheStart';
import SslVsTlsPost from './posts/SslVsTls';

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  category: string;
  readingTime: string;
  image: string;
  excerpt: string;
}

const postsMetadata: PostMetadata[] = [
  {
    slug: 'ssl-and-tls',
    title: 'SSL and TLS (and the things around them)',
    date: 'July 4, 2026',
    category: 'Networking',
    readingTime: '4 min read',
    image: sslVsTlsImg,
    excerpt: "You're using SSL/TLS literally right now, to read this page safely. SSL/TLS is the encryption-based security protocol that keeps your data secure.",
  },
  {
    slug: 'marking-the-start',
    title: 'Marking the Start',
    date: 'July 3, 2026',
    category: 'Life',
    readingTime: '2 min read',
    image: hiImg,
    excerpt: 'I guess this officially marks the start of me writing stuff here. A space to share things I build, break, learn, or obsess over.',
  },
];

const postComponents: Record<string, React.ComponentType> = {
  'marking-the-start': MarkingTheStartPost,
  'ssl-and-tls': SslVsTlsPost,
};

interface PostsPageProps {
  currentPostSlug?: string | null;
  onNavigatePost?: (slug: string | null) => void;
}

const PostsPage = ({ currentPostSlug, onNavigatePost }: PostsPageProps) => {
  const activePost = currentPostSlug ? postsMetadata.find(p => p.slug === currentPostSlug) : null;
  const [hoveredPostSlug, setHoveredPostSlug] = useState<string | null>(null);

  const handleCardClick = (slug: string) => {
    if (onNavigatePost) {
      onNavigatePost(slug);
    }
  };

  if (activePost) {
    const PostComponent = postComponents[activePost.slug];
    if (PostComponent) {
      return <PostComponent />;
    }
  }

  const featuredPost = postsMetadata[0];
  const rightPosts = postsMetadata.slice(1, 4);
  const olderPosts = postsMetadata.slice(4);

  return (
    <motion.section
      key="posts-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-start justify-center px-6 md:px-12 lg:px-20 pt-14 lg:pt-18 pb-12 lg:pb-8 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      <div className="w-full max-w-[76rem] h-auto lg:h-full lg:overflow-y-auto lg:no-scrollbar pt-6 lg:pt-0">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 lg:mb-6 pt-4 lg:pt-6"
        >
          <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
            posts
            <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.2} />
          </div>
        </motion.div>

        {/* The Anthropic Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-auto pb-12 items-start">
          
          {/* LEFT: Featured Post (spans 8 of 12 columns) */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              onClick={() => handleCardClick(featuredPost.slug)}
              className="lg:col-span-8 flex flex-col cursor-pointer group bg-transparent"
              data-cursor-snap
            >
              {/* Image Container */}
              <div className="w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden rounded-2xl relative bg-bg/50">
                <motion.img
                  layoutId={`post-image-${featuredPost.slug}`}
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover post-image-zoom"
                />
                <div className="absolute top-4 left-4 bg-bg/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border/30 text-[10px] font-mono text-accent uppercase tracking-wider animate-fade-in">
                  Latest
                </div>
              </div>
              
              {/* Content underneath (side-by-side) */}
              <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow items-start">
                {/* Title */}
                <div className="md:col-span-7">
                  <motion.h2
                    layoutId={`post-title-${featuredPost.slug}`}
                    className="text-lg md:text-xl lg:text-2xl font-bold font-mono group-hover:text-link transition-colors duration-300 leading-tight text-text"
                  >
                    {featuredPost.title}
                  </motion.h2>
                </div>
                
                {/* Meta & Excerpt */}
                <div className="md:col-span-5 flex flex-col justify-start">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1 block">
                    {featuredPost.category} • {featuredPost.date}
                  </span>
                  <p className="text-xs text-muted/80 font-mono leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* RIGHT: Stack of up to 3 Text-only Posts (spans 4 of 12 columns) */}
          {rightPosts.length > 0 && (
            <div className="lg:col-span-4 flex flex-col divide-y divide-border/15 lg:pl-6">
              {rightPosts.map((post) => (
                <div
                  key={post.slug}
                  onClick={() => handleCardClick(post.slug)}
                  className="flex flex-col cursor-pointer group bg-transparent py-4 first:pt-0 last:pb-0 justify-center flex-shrink-0"
                  data-cursor-snap
                >
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-mono text-muted/65 uppercase tracking-wider block">
                      {post.category} • {post.date}
                    </div>
                    <motion.h3
                      layoutId={`post-title-${post.slug}`}
                      className="text-xs md:text-sm font-semibold font-mono text-text group-hover:text-link transition-colors duration-300 leading-snug"
                    >
                      {post.title}
                    </motion.h3>
                    <p className="text-[11px] text-muted/75 font-mono leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* More Blogs Title & Table (if there are any older posts) */}
        {olderPosts.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-12 mb-8 pt-4"
            >
              <div className="text-[11px] font-bold tracking-widest text-muted uppercase font-mono pb-2 relative max-w-max">
                more blogs
                <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.3} />
              </div>
            </motion.div>

            {/* Archive Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24 items-start relative">
              
              {/* Left Column (Table List) */}
              <div className="lg:col-span-8 flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border/30 font-mono text-[9px] uppercase tracking-wider text-muted/70">
                  <div className="col-span-3 md:col-span-2">Date</div>
                  <div className="col-span-4 md:col-span-3">Category</div>
                  <div className="col-span-5 md:col-span-7">Title</div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-border/15">
                  {olderPosts.map((post) => (
                    <div
                      key={post.slug}
                      onClick={() => handleCardClick(post.slug)}
                      onMouseEnter={() => setHoveredPostSlug(post.slug)}
                      onMouseLeave={() => setHoveredPostSlug(null)}
                      className="grid grid-cols-12 gap-4 py-4 items-center cursor-pointer group hover:bg-accent/2 transition-colors duration-200"
                      data-cursor-snap
                    >
                      <div className="col-span-3 md:col-span-2 font-mono text-[10px] text-muted group-hover:text-accent transition-colors duration-200">
                        {post.date}
                      </div>
                      <div className="col-span-4 md:col-span-3 font-mono text-[10px] text-muted group-hover:text-accent transition-colors duration-200">
                        {post.category}
                      </div>
                      <motion.div
                        layoutId={`post-title-${post.slug}`}
                        className="col-span-5 md:col-span-7 font-mono text-sm font-medium text-text group-hover:text-link group-hover:underline decoration-link/40 decoration-1 underline-offset-4 transition-all duration-200 leading-snug"
                      >
                        {post.title}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (Fixed Preview Image) */}
              <div className="lg:col-span-4 hidden lg:flex justify-center items-start lg:pt-6">
                <div className="w-56 h-56 rounded-2xl border border-border/20 overflow-hidden bg-bg/40 relative flex-shrink-0 flex items-center justify-center shadow-lg shadow-bg/20">
                  {olderPosts.map((p) => {
                    const isVisible = hoveredPostSlug ? hoveredPostSlug === p.slug : p.slug === olderPosts[0].slug;
                    return (
                      <motion.img
                        key={p.slug}
                        src={p.image}
                        alt={p.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    );
                  })}
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </motion.section>
  );
};

export default PostsPage;

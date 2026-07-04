import DrawingLine from './DrawingLine';

const SectionThree = () => {
  return (
    <section className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-10 md:pt-12 lg:pt-24 pb-6 md:pb-8 lg:pb-8 relative overflow-hidden lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 w-full max-w-[76rem] h-auto lg:max-h-[85vh] lg:overflow-y-auto lg:no-scrollbar">
        
        {/* Left Column - Academic Background & Activities */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-start space-y-6">
          
          <div className="space-y-4">
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              academic background
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.4} />
            </div>
            
            <div className="space-y-4 font-mono text-xs md:text-sm">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">vishwakarma institute of technology</span>
                  <span className="text-[11px] uppercase font-mono text-muted">pune</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  bachelor of technology (b.tech) · 2023 – 2027
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">cgpa</span>
                  <span className="text-[11px] uppercase font-mono text-accent">8.98 / 10.0</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  consistent academic performance across all semesters.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 relative">
            <DrawingLine direction="horizontal" className="top-0 left-0 text-border/30" delay={0.5} />
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              college activities
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.55} />
            </div>
            
            <div className="space-y-4 font-mono text-xs md:text-sm">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">ieee</span>
                  <span className="text-[11px] uppercase font-mono text-muted">backend lead</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  led the web development team to ship a robust inventory management system.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">ieee</span>
                  <span className="text-[11px] uppercase font-mono text-muted">workshop instructor</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  instructed an extensive deep dive in ai agents workshop during the early adoption phase.
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">ieee</span>
                  <span className="text-[11px] uppercase font-mono text-muted">executive member</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  contributed to the organization and execution of key technical events.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Achievements & Certifications */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-start space-y-6 font-mono text-xs md:text-sm">
          
          <div className="space-y-4">
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              key achievements
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.5} />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">top 150 – amazon ml challenge 2025</span>
                  <span className="text-[11px] uppercase font-mono text-muted">national</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  ranked among the top 150 out of 80,000+ participants nationwide, optimizing neural models to achieve minimal validation loss.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">top 4 – google's wow verse hackathon 2025</span>
                  <span className="text-[11px] uppercase font-mono text-muted">international</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  selected among the top 4 teams globally; presented a production-ready solution to GDG Developer Relations.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 relative">
            <DrawingLine direction="horizontal" className="top-0 left-0 text-border/30" delay={0.6} />
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              certifications
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.65} />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-text font-mono">ibm full stack developer certificate</span>
                  <span className="text-[11px] uppercase font-mono text-muted">professional</span>
                </div>
                <p className="text-muted text-xs mt-1">
                  professional certification program covering frontend frameworks, backend servers, and containerized deployment pipelines.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SectionThree;

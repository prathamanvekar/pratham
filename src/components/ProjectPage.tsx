import React, { useEffect } from 'react';
import Ergen from './projects/Ergen';
import Ebfer from './projects/Ebfer';
import Proxie from './projects/Proxie';
import Qupload from './projects/Qupload';
import Gator from './projects/Gator';
import Sentinel from './projects/Sentinel';
import YieldProject from './projects/Yield';
import Cybully from './projects/Cybully';
import SentryProject from './projects/Sentry';
import Prismo from './projects/Prismo';
import Gaze from './projects/Gaze';
import Rssgen from './projects/Rssgen';

interface ProjectPageProps {
  slug: string;
  layoutSource: 'home' | 'projects';
  onBack: () => void;
}

const projectComponents: Record<
  string,
  React.ComponentType<{ layoutSource: 'home' | 'projects' }>
> = {
  ergen: Ergen,
  ebfer: Ebfer,
  proxie: Proxie,
  qupload: Qupload,
  gator: Gator,
  sentinel: Sentinel,
  yield: YieldProject,
  cybully: Cybully,
  sentry: SentryProject,
  prismo: Prismo,
  gaze: Gaze,
  rssgen: Rssgen,
};

const ProjectPage = ({ slug, layoutSource, onBack }: ProjectPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const TargetComponent = projectComponents[slug];

  if (!TargetComponent) {
    return (
      <div className="w-screen h-screen flex items-center justify-center font-mono text-xs text-muted">
        project not found.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <TargetComponent layoutSource={layoutSource} />
      
      {/* Back button at the bottom of the page on mobile */}
      <div className="w-full flex justify-center pb-24 pt-4 lg:hidden">
        <button
          onClick={onBack}
          className="cursor-pointer bg-transparent border border-border/30 hover:border-accent/60 text-muted hover:text-accent transition-all duration-200 font-mono text-xs px-6 py-2.5 rounded-sm"
        >
          ← back
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;

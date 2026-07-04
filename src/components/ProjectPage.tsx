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

const ProjectPage = ({ slug, layoutSource }: ProjectPageProps) => {
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

  return <TargetComponent layoutSource={layoutSource} />;
};

export default ProjectPage;

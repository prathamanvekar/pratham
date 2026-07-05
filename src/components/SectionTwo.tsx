import { useEffect, useState } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import DrawingLine from './DrawingLine';

const GithubActivity = ({ data }: { data: any[] }) => {
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark');
  const [blockSize, setBlockSize] = useState(8);

  useEffect(() => {
    // Sync with html tag class to dynamically update calendar theme
    const updateTheme = () => {
      const isLight = document.documentElement.classList.contains('light');
      setColorMode(isLight ? 'light' : 'dark');
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Use block size 8 on desktop (lg grid split) to fit in the right column, and 10 on tablet/mobile
      setBlockSize(window.innerWidth >= 1024 ? 8 : 10);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom monochrome/lavender theme matching our light/dark modes
  const customTheme = {
    dark: ['#1c1c1e', '#3f384a', '#6a518a', '#956ebd', '#b39ddb'],
    light: ['#ebebeb', '#d9ccf0', '#b094db', '#8e62c9', '#673ab7']
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2 no-scrollbar flex justify-start">
        {data.length > 0 ? (
          <ActivityCalendar
            data={data}
            theme={customTheme}
            colorScheme={colorMode}
            blockSize={blockSize}
            blockMargin={2}
          />
        ) : (
          <div className="h-20 flex items-center justify-start text-xs text-muted/50 font-mono">Loading activity grid...</div>
        )}
      </div>
    </div>
  );
};

const SectionTwo = () => {
  const username = "prathamanvekar";

  // Fallback initializations to ensure UI is always populated and robust
  const FALLBACK_STATS = { repos: '...', stars: '...', streak: '...' };

  const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // State initialization loading from cache if present, otherwise using fallback
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('github_stats');
      return cached ? JSON.parse(cached) : FALLBACK_STATS;
    } catch {
      return FALLBACK_STATS;
    }
  });

  const [calendarData, setCalendarData] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('github_calendar');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [languages, setLanguages] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('github_languages');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [featuredRepos, setFeaturedRepos] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('github_featured_repos');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const lastFetch = localStorage.getItem('github_last_fetch');
        const isCacheValid = lastFetch && (Date.now() - Number(lastFetch) < CACHE_DURATION);

        // If cache is valid and we have data cached, don't re-fetch
        if (isCacheValid) {
          const cachedStats = localStorage.getItem('github_stats');
          const cachedCalendar = localStorage.getItem('github_calendar');
          const cachedLangs = localStorage.getItem('github_languages');
          const cachedFeatured = localStorage.getItem('github_featured_repos');

          if (cachedStats && cachedCalendar && cachedLangs && cachedFeatured) {
            console.log('Using cached GitHub metrics.');
            return;
          }
        }

        // 1. Fetch live repository counter from GitHub Profile
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        const profile = await profileRes.json();
        let fetchedReposCount = null;
        if (profile && typeof profile.public_repos === 'number') {
          fetchedReposCount = profile.public_repos;
        }

        // 2. Fetch live contributions calendar grid & compute timezone-aware contribution streak
        const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        const contribData = await contribRes.json();
        const contributions = contribData.contributions;

        let filteredContributions = null;
        let streakStr = null;
        if (Array.isArray(contributions)) {
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setDate(today.getDate() - 365);

          const filtered = contributions.filter((day: any) => {
            const d = new Date(day.date);
            return d >= oneYearAgo && d <= today;
          });

          // Sort chronologically (oldest to newest) for react-activity-calendar
          filteredContributions = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          // Timezone-aware date string function
          const getLocalDateString = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          // Compute current streak from newest to oldest
          const sorted = [...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const todayStr = getLocalDateString(new Date());
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getLocalDateString(yesterday);

          let hasActivity = false;
          let startIndex = 0;

          for (let i = 0; i < sorted.length; i++) {
            if (sorted[i].date === todayStr && sorted[i].count > 0) {
              hasActivity = true;
              startIndex = i;
              break;
            }
            if (sorted[i].date === yesterdayStr && sorted[i].count > 0) {
              hasActivity = true;
              startIndex = i;
              break;
            }
          }

          let streak = 0;
          if (hasActivity) {
            for (let i = startIndex; i < sorted.length; i++) {
              if (sorted[i].count > 0) {
                streak++;
              } else {
                break;
              }
            }
          }
          streakStr = `${streak} ${streak === 1 ? 'day' : 'days'}`;
        }

        // 3. Fetch repositories list for Stars, Languages, and Top Starred Repositories
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const repos = await reposRes.json();

        let totalStars = 0;
        let sortedLangs: string[] = [];
        let topRepos: any[] = [];

        if (Array.isArray(repos)) {
          totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

          const langMap: { [key: string]: number } = {};
          repos.forEach(repo => {
            if (repo.language) {
              langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            }
          });
          sortedLangs = Object.entries(langMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name]) => name.toLowerCase());

          topRepos = [...repos]
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 2)
            .map(repo => ({
              name: repo.name,
              description: repo.description || "No description provided.",
              stars: repo.stargazers_count,
              language: repo.language ? repo.language.toLowerCase() : "unknown",
              url: repo.html_url
            }));
        }

        // Update states and cache
        if (fetchedReposCount !== null || streakStr !== null || Array.isArray(repos)) {
          setStats((prev: any) => {
            const next = {
              ...prev,
              repos: fetchedReposCount !== null ? fetchedReposCount : (Array.isArray(repos) ? repos.length : prev.repos),
              streak: streakStr !== null ? streakStr : prev.streak,
              stars: Array.isArray(repos) ? totalStars.toLocaleString() : prev.stars
            };
            localStorage.setItem('github_stats', JSON.stringify(next));
            return next;
          });
        }

        if (filteredContributions) {
          setCalendarData(filteredContributions);
          localStorage.setItem('github_calendar', JSON.stringify(filteredContributions));
        }

        if (sortedLangs.length > 0) {
          setLanguages(sortedLangs);
          localStorage.setItem('github_languages', JSON.stringify(sortedLangs));
        }

        if (topRepos.length > 0) {
          setFeaturedRepos(topRepos);
          localStorage.setItem('github_featured_repos', JSON.stringify(topRepos));
        }

        // Set fetch timestamp
        localStorage.setItem('github_last_fetch', Date.now().toString());
        console.log('GitHub metrics updated and cached successfully.');
      } catch (err) {
        console.error('Failed to fetch live GitHub metrics:', err);
      }
    };

    fetchGithubData();
  }, []);

  return (
    <section className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-10 md:pt-12 lg:pt-24 pb-6 md:pb-8 lg:pb-8 relative overflow-hidden lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 w-full max-w-[76rem] h-auto lg:max-h-[85vh] lg:overflow-y-auto lg:no-scrollbar">

        {/* Left Column - Skills */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-start space-y-6">
          <div className="space-y-4">
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              technical skills
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.4} />
            </div>

            <div className="space-y-4 font-mono text-xs md:text-sm">
              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">languages</span>
                <span className="text-accent">go, python, c, c++, typescript, sql, bash</span>
              </div>

              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">frameworks</span>
                <span className="text-text">fastapi, pytorch, nodejs, react, genai / agents, gin</span>
              </div>

              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">databases</span>
                <span className="text-text">postgresql, mongodb, turso / sqlite, mysql, redis</span>
              </div>

              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">tools & workflow</span>
                <span className="text-text">git, docker, linux</span>
              </div>
            </div>
          </div>

          {/* Competitive Programming */}
          <div className="space-y-4 pt-4 relative">
            <DrawingLine direction="horizontal" className="top-0 left-0 text-border/30" delay={0.5} />
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              competitive programming
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.6} />
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* CodeChef */}
              <div className="flex items-center justify-between">
                <span className="text-muted uppercase text-[10px] tracking-wider">codechef</span>
                <span className="text-text">2 <span className="text-muted text-[10px]">star</span></span>
              </div>

              {/* Codeforces */}
              <div className="flex items-center justify-between">
                <span className="text-muted uppercase text-[10px] tracking-wider">codeforces</span>
                <span className="text-text">1090<span className="text-muted">+</span> <span className="text-muted text-[10px]">rating</span></span>
              </div>

              {/* LeetCode */}
              <div className="flex items-center justify-between">
                <span className="text-muted uppercase text-[10px] tracking-wider">leetcode</span>
                <div className="flex items-center gap-3">
                  <span className="text-text">1340<span className="text-muted">+</span> <span className="text-muted text-[10px]">rating</span></span>
                  <span className="text-border/60">|</span>
                  <span className="text-text">222<span className="text-muted">+</span> <span className="text-muted text-[10px]">solved</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - GitHub Data */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-start space-y-6 text-xs md:text-sm text-muted font-normal lowercase leading-relaxed">

          <div className="space-y-4">
            <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
              github metrics
              <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.5} />
            </div>

            <div className="grid grid-cols-3 gap-6 font-mono">
              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">repositories</span>
                <span className="text-text text-base">{stats.repos}</span>
              </div>
              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">total stars</span>
                <span className="text-text text-base">{stats.stars}</span>
              </div>
              <div>
                <span className="text-xs uppercase text-muted block mb-0.5">current streak</span>
                <span className="text-text text-base">{stats.streak}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center max-w-[20rem]">
              <span className="text-xs uppercase text-muted font-mono mb-0.5">contributions (past year)</span>
            </div>
            <GithubActivity data={calendarData} />
          </div>

          {/* Bottom Section - Languages & Popular Repositories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 relative">
            <DrawingLine direction="horizontal" className="top-0 left-0 text-border/30" delay={0.6} />
            {/* Top Languages Column */}
            <div className="space-y-4">
              <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
                top languages
                <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.7} />
              </div>
              <div className="space-y-3 font-mono">
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <div key={lang} className="text-xs flex items-center justify-between">
                      <span className="text-text">{lang}</span>
                      <span className="text-muted flex items-center justify-center">
                        {getLanguageIcon(lang)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted/60">loading languages...</div>
                )}
              </div>
            </div>

            {/* Popular Repositories Column */}
            <div className="space-y-4">
              <div className="text-sm font-semibold tracking-wider text-accent uppercase font-mono pb-2 relative max-w-max">
                popular repositories
                <DrawingLine direction="horizontal" className="bottom-0 left-0 text-border/40" delay={0.8} />
              </div>
              <div className="space-y-4 font-mono">
                {featuredRepos.length > 0 ? (
                  featuredRepos.map((repo) => (
                    <div key={repo.name} className="text-xs">
                      <div className="flex justify-between items-baseline gap-2">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underlined-link font-medium truncate max-w-[80%]"
                          title={repo.name}
                        >
                          {repo.name}
                        </a>
                        <span className="text-[10px] text-muted whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                          ★ {repo.stars}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted/60">loading popular repositories...</div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

const getLanguageIcon = (lang: string) => {
  const normalized = lang.toLowerCase().trim();
  let url = '';

  switch (normalized) {
    case 'python':
      url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg';
      break;
    case 'typescript':
    case 'ts':
      url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg';
      break;
    case 'javascript':
    case 'js':
      url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg';
      break;
    case 'go':
    case 'golang':
      url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg';
      break;
    case 'c':
      url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg';
      break;
    case 'c++':
    case 'cpp':
      url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg';
      break;
    default:
      url = '';
  }

  if (url) {
    return (
      <img
        src={url}
        alt={lang}
        className="w-4 h-4 object-contain"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
};

export default SectionTwo;

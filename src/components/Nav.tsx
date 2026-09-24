import { useEffect, useState } from 'react';
import { useUI } from '../ui';

interface Props {
  view: 'home' | 'studio' | 'feed';
  feedCount: number;
  rep: number;
  onHome: () => void;
  onFeed: () => void;
  onAbout: () => void;
}

export default function Nav({ view, feedCount, rep, onHome, onFeed, onAbout }: Props) {
  const { theme, lang, t, toggleTheme, toggleLang } = useUI();
  const level = Math.floor(rep / 1000) + 1;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const captureActive = view === 'home' || view === 'studio';

  return (
    <header className="nav" data-scrolled={scrolled ? 'true' : undefined}>
      <div className="nav__in">
        <button className="brand" onClick={onHome} aria-label="Snapmatic | Leonida">
          <span className="brand__name">Snapmatic</span>
          <span className="brand__sep">|</span>
          <span className="brand__loc">Leonida</span>
        </button>

        <nav className="seg">
          <button
            className={`seg__b${captureActive ? ' on' : ''}`}
            onClick={onHome}
          >
            {t.nav.capture}
          </button>
          <button
            className={`seg__b${view === 'feed' ? ' on' : ''}`}
            onClick={onFeed}
          >
            {t.nav.feed} <span className="seg__cnt">{feedCount}</span>
          </button>
          <button className="seg__b" onClick={onAbout}>
            {t.nav.about}
          </button>
        </nav>

        <div className="nav__right">
          <div className="repchip" title={`${rep} ${t.social.rep}`}>
            <span className="repchip__ring" style={{ ['--p' as string]: `${rep % 1000 / 10}%` }} />
            <span className="repchip__lv">
              {t.social.level} {level}
            </span>
            <span className="repchip__rep">{rep.toLocaleString()}</span>
          </div>

          <button className="lang" onClick={toggleLang} aria-label="Toggle language" title="EN / PT">
            {lang === 'en' ? (
              <>
                <b>EN</b> <span>/ pt</span>
              </>
            ) : (
              <>
                <b>PT</b> <span>/ en</span>
              </>
            )}
          </button>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Light' : 'Dark'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  );
}

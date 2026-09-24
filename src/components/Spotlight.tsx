import { useEffect, useRef, useState } from 'react';
import { SCENES } from '../data/scenes';
import { pick, type Scene } from '../types';
import { useUI } from '../ui';

const FEATURED = [
  'the-keys',
  'squalo-sunset',
  'vice-style',
  'ink-neon',
  'late-night-run',
  'golden-hour',
];

interface Props {
  onShoot: (s: Scene) => void;
  onPreview: (s: Scene) => void;
}

export default function Spotlight({ onShoot, onPreview }: Props) {
  const { lang, t } = useUI();
  const items = FEATURED.map((id) => SCENES.find((s) => s.id === id)).filter(
    (s): s is Scene => Boolean(s),
  );
  const [i, setI] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setI((v) => (v + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [items.length]);

  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);
  const cur = items[i];
  if (!cur) return null;

  return (
    <section className="section">
      <div className="wrap">
        <div className="kicker reveal">
          <span className="kicker__label">
            <b>◆</b>
            {t.spot.kicker}
          </span>
          <span className="kicker__num">
            {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>

        <div
          className="spotlight reveal"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          {items.map((s, idx) => (
            <img
              key={s.id}
              className={`spotlight__img${idx === i ? ' on' : ''}`}
              src={s.image}
              alt={pick(s.title, lang)}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <span className="spotlight__scrim" />
          <button
            className="spotlight__hit"
            onClick={() => onPreview(cur)}
            aria-label={t.modal.preview}
          />

          <span className="spotlight__live">
            <span className="pill__dot" />
            {t.spot.live}
          </span>

          <div className="spotlight__meta">
            <span className="spotlight__cat">
              {pick(cur.category, lang)} · {cur.location}
            </span>
            <h3 className="spotlight__title">{pick(cur.title, lang)}</h3>
            <p className="spotlight__blurb">{pick(cur.blurb, lang)}</p>
            <button className="btn btn--primary" onClick={() => onShoot(cur)}>
              {t.spot.open} <span className="arw">↘</span>
            </button>
          </div>

          <button className="spotlight__nav prev" onClick={() => go(-1)} aria-label={t.spot.prev}>
            ‹
          </button>
          <button className="spotlight__nav next" onClick={() => go(1)} aria-label={t.spot.next}>
            ›
          </button>

          <div className="spotlight__dots">
            {items.map((s, idx) => (
              <button
                key={s.id}
                className={`dot${idx === i ? ' on' : ''}`}
                onClick={() => setI(idx)}
                aria-label={`${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

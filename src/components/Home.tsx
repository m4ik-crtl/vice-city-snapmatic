import { useRef, useState } from 'react';
import Marquee from './Marquee';
import Spotlight from './Spotlight';
import Modal from './Modal';
import { SCENES } from '../data/scenes';
import { pick, type Scene } from '../types';
import { useUI } from '../ui';

interface Props {
  onPick: (scene: Scene) => void;
  onFeed: () => void;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Home({ onPick, onFeed }: Props) {
  const { lang, t } = useUI();
  const [preview, setPreview] = useState<Scene | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onPick({
        id: `custom-${Date.now()}`,
        title: { en: t.custom.title, pt: t.custom.title },
        location: t.custom.location,
        category: { en: t.custom.category, pt: t.custom.category },
        blurb: { en: t.custom.blurb, pt: t.custom.blurb },
        image: dataUrl,
        accent: '#22d3ee',
        tags: ['#MySnap', '#GTA6'],
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <span className="hero__grid" aria-hidden="true" />
        <div className="hero__sun" />
        <div className="hero__in">
          <p className="hero__kicker reveal" style={{ ['--d' as string]: '0ms' }}>
            <b>●</b> {t.hero.kicker}
          </p>
          <h1 className="hero__title reveal" style={{ ['--d' as string]: '90ms' }}>
            {t.hero.t1}
            <br />
            <span className="t2">{t.hero.t2}</span>
          </h1>
          <p className="hero__lead reveal" style={{ ['--d' as string]: '220ms' }}>
            {t.hero.lead1}
            <span className="muted">{t.hero.leadMuted}</span>
          </p>
          <div className="hero__ctas reveal" style={{ ['--d' as string]: '320ms' }}>
            <button className="btn btn--primary" onClick={() => scrollTo('moments')}>
              {t.hero.cta1} <span className="arw">↘</span>
            </button>
            <button className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
              {t.upload.title} <span className="arw">↑</span>
            </button>
            <button className="btn btn--ghost" onClick={onFeed}>
              {t.hero.cta2} <span className="arw">→</span>
            </button>
          </div>
        </div>
      </section>

      <Marquee />

      {/* SPOTLIGHT (replaces KPIs) */}
      <Spotlight onShoot={onPick} onPreview={setPreview} />

      {/* MOMENTS */}
      <section className="section" id="moments">
        <div className="wrap">
          <div className="kicker reveal">
            <span className="kicker__label">
              <b>◆</b>
              {t.moments.kicker}
            </span>
            <span className="kicker__num">(01)</span>
          </div>
          <h2 className="sec-title reveal">
            {t.moments.t1} <span className="t2">{t.moments.t2}</span>
          </h2>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />

          <div className="gallery">
            {/* Upload-your-own card */}
            <button
              className="moment moment--upload"
              style={{ ['--d' as string]: '0ms' }}
              onClick={() => fileRef.current?.click()}
            >
              <div className="upload">
                <span className="upload__plus">+</span>
                <span className="upload__title">{t.upload.title}</span>
                <span className="upload__hint">{t.upload.hint}</span>
              </div>
            </button>

            {SCENES.map((scene, i) => (
              <button
                key={scene.id}
                className="moment"
                style={{
                  ['--accent' as string]: scene.accent,
                  ['--d' as string]: `${Math.min(i + 1, 10) * 45}ms`,
                }}
                onClick={() => setPreview(scene)}
              >
                <div className="moment__imgwrap">
                  <span className="moment__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="moment__edit">{t.modal.preview} ⤢</span>
                  <span className="moment__shine" />
                  <img
                    className="moment__img"
                    src={scene.image}
                    alt={pick(scene.title, lang)}
                    loading="lazy"
                  />
                </div>
                <div className="moment__body">
                  <div className="moment__meta">
                    <span className="moment__loc">{scene.location}</span>
                    <span className="moment__cat">{pick(scene.category, lang)}</span>
                  </div>
                  <h3 className="moment__title">{pick(scene.title, lang)}</h3>
                  <p className="moment__blurb">{pick(scene.blurb, lang)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="wrap">
          <div className="kicker reveal">
            <span className="kicker__label">
              <b>◆</b>
              {t.about.kicker}
            </span>
            <span className="kicker__num">(02)</span>
          </div>
          <h2 className="sec-title reveal">
            {t.about.t1} <span className="t2">{t.about.t2}</span>
          </h2>

          <div className="about-grid">
            <div className="about-body reveal">
              <p className="about-lead">{t.about.lead}</p>
              <p>{t.about.body}</p>
              <ul className="checklist">
                {t.about.checklist.map((item) => (
                  <li key={item}>
                    <span className="ck">✳</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="author-card reveal" style={{ ['--d' as string]: '120ms' }}>
              <div className="mono">MAIKON — SILVA ▪</div>
              <h4>Maikon Silva</h4>
              <p className="role">{t.about.role}</p>
              <div className="author-links">
                <a href="https://portfoliomaikon.netlify.app" target="_blank" rel="noreferrer">
                  {t.about.portfolio} <span className="arw">↗</span>
                </a>
                <a
                  href="https://github.com/unlayer/react-image-editor"
                  target="_blank"
                  rel="noreferrer"
                >
                  React Image Editor <span className="arw">↗</span>
                </a>
                <a href="mailto:mcharles784@gmail.com">
                  Email <span className="arw">↗</span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* MOMENT PREVIEW MODAL */}
      <Modal open={!!preview} onClose={() => setPreview(null)} wide label="Moment preview">
        {preview && (
          <div className="mpreview">
            <div className="mpreview__img">
              <img src={preview.image} alt={pick(preview.title, lang)} />
              <span className="mpreview__cat">{pick(preview.category, lang)}</span>
            </div>
            <div className="mpreview__body">
              <span className="mpreview__loc">{preview.location}</span>
              <h3 className="mpreview__title">{pick(preview.title, lang)}</h3>
              <p className="mpreview__blurb">{pick(preview.blurb, lang)}</p>
              <div className="mpreview__tags">
                {preview.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                className="btn btn--primary btn--block"
                onClick={() => {
                  const s = preview;
                  setPreview(null);
                  onPick(s);
                }}
              >
                {t.modal.open} <span className="arw">↘</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

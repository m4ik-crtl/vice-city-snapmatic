import { useMemo, useRef, useState } from 'react';
import ImageEditor, {
  type ImageEditorInstance,
  type ImageEditorOptions,
  type ImageEditorRef,
  type ImageEditorSaveResult,
} from '@unlayer/react-image-editor';
import { pick, type Scene } from '../types';
import { useUI } from '../ui';

interface Props {
  scene: Scene;
  onBack: () => void;
  onPost: (data: { image: string; caption: string; author: string }) => void;
}

/** Optional: set VITE_UNLAYER_PROJECT_ID in .env to unlock the AI Assistant. */
const PROJECT_ID = Number(import.meta.env.VITE_UNLAYER_PROJECT_ID) || undefined;

export default function EditorView({ scene, onBack, onPost }: Props) {
  const { theme, lang, t } = useUI();
  const editorRef = useRef<ImageEditorRef>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [edited, setEdited] = useState<string | null>(null);
  const [author, setAuthor] = useState('Tommy_V');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>(scene.tags);
  const [status, setStatus] = useState('');
  const [statusOk, setStatusOk] = useState(false);

  const options = useMemo<ImageEditorOptions>(
    () => ({
      theme: theme === 'light' ? 'light' : 'dark',
      ...(PROJECT_ID ? { projectId: PROJECT_ID } : {}),
    }),
    [theme],
  );

  const toggleTag = (tag: string) =>
    setTags((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]));

  const say = (msg: string, ok = false) => {
    setStatus(msg);
    setStatusOk(ok);
  };

  const handleSave = (result: ImageEditorSaveResult) => {
    setEdited(result.dataUrl);
    say(t.studio.saved, true);
  };

  const grabImage = (): string => {
    const inst: ImageEditorInstance | null = editorRef.current?.editor ?? null;
    const live = inst?.getImage?.() ?? null;
    return live || edited || scene.image;
  };

  const post = () => {
    const image = grabImage();
    const composed = [caption.trim(), ...tags].filter(Boolean).join(' ');
    onPost({ image, caption: composed, author: author.trim() || 'Anon_VC' });
  };

  return (
    <section className="section studio">
      <div className="wrap">
        <div className="kicker reveal">
          <span className="kicker__label">
            <b>◆</b>
            {t.studio.title}
          </span>
          <span className="kicker__num">(02)</span>
        </div>

        <div className="studio__head reveal">
          <div>
            <div className="loc">{scene.location}</div>
            <h2>{pick(scene.title, lang)}</h2>
          </div>
          <button className="backlink" onClick={onBack}>
            ← {t.studio.back}
          </button>
        </div>
      </div>

      {/* full-bleed editor */}
      <div className="stage-full reveal" style={{ ['--d' as string]: '90ms' }}>
        <div className="stage">
          {failed ? (
            <div className="stage__fallback">
              <img src={scene.image} alt={pick(scene.title, lang)} />
              <h3 className="display" style={{ fontSize: 24 }}>
                {t.studio.fallbackTitle}
              </h3>
              <p>{t.studio.fallbackBody}</p>
              <button className="btn btn--primary" onClick={post}>
                {t.studio.postAnyway} →
              </button>
            </div>
          ) : (
            <ImageEditor
              ref={editorRef}
              image={scene.image}
              minHeight={680}
              options={options}
              onLoad={() => {
                setReady(true);
                say(t.studio.ready);
              }}
              onSave={handleSave}
              onCancel={() => say(t.studio.cancelled)}
              onLoadError={() => say(t.studio.decodeErr)}
              onError={() => setFailed(true)}
            />
          )}
        </div>
      </div>

      {/* controls strip */}
      <div className="wrap">
        <div className="poststrip">
          <div className="poststrip__grid">
            <div className="field">
              <label htmlFor="author">{t.studio.handle}</label>
              <input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={24}
                placeholder={t.studio.handlePh}
              />
            </div>

            <div className="field">
              <label htmlFor="caption">{t.studio.caption}</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                maxLength={180}
                placeholder={pick(scene.blurb, lang)}
              />
            </div>

            <div className="poststrip__tagcol">
              <span className="grouplabel">{t.studio.hashtags}</span>
              <div className="chips">
                {scene.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`chip${tags.includes(tag) ? ' on' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="poststrip__actions">
              <p className={`status${statusOk ? ' ok' : ''}`}>
                {status || (!ready && !failed ? t.studio.loading : '')}
              </p>
              <button className="btn btn--primary btn--block" onClick={post} disabled={failed}>
                {edited ? t.studio.postSaved : t.studio.postCurrent} <span className="arw">↘</span>
              </button>
              <button className="btn btn--ghost btn--block btn--sm" onClick={onBack}>
                {t.studio.discard}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

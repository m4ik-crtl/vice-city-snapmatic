import { useMemo, useState } from 'react';
import Modal from './Modal';
import type { Post } from '../types';
import { useUI } from '../ui';

type Tab = 'latest' | 'trending' | 'nearby';

interface Props {
  posts: Post[];
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onStart: () => void;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function download(post: Post) {
  const a = document.createElement('a');
  a.href = post.image;
  a.download = `snapmatic-${post.sceneId}-${post.id}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function renderCaption(caption: string) {
  return caption.split(/(\s+)/).map((tok, i) =>
    tok.startsWith('#') ? (
      <span className="tag" key={i}>
        {tok}
      </span>
    ) : (
      <span key={i}>{tok}</span>
    ),
  );
}

export default function Feed({ posts, onLike, onRepost, onStart }: Props) {
  const { t, lang } = useUI();
  const [tab, setTab] = useState<Tab>('latest');
  const [light, setLight] = useState<Post | null>(null);

  const suffix = lang === 'pt' ? ' atrás' : ' ago';
  const timeAgo = (ts: number): string => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return t.feed.justNow;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m${suffix}`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h${suffix}`;
    return `${Math.floor(h / 24)}d${suffix}`;
  };

  const shown = useMemo(() => {
    const list = [...posts];
    if (tab === 'trending')
      return list.sort((a, b) => b.likes + b.reposts * 2 - (a.likes + a.reposts * 2));
    if (tab === 'nearby') return list.filter((p) => p.nearby);
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'latest', label: t.social.tabAll },
    { key: 'trending', label: t.social.tabTrending },
    { key: 'nearby', label: t.social.tabNearby },
  ];

  const live = light ? posts.find((p) => p.id === light.id) ?? light : null;

  return (
    <section className="section">
      <div className="wrap">
        <div className="kicker reveal">
          <span className="kicker__label">
            <b>◆</b>
            {t.feed.kicker}
          </span>
          <span className="kicker__num">(03)</span>
        </div>
        <h2 className="sec-title reveal">
          {t.feed.t1} <span className="t2">{t.feed.t2}</span>
        </h2>

        <div className="feedbar reveal">
          <div className="feedtabs">
            {tabs.map((x) => (
              <button
                key={x.key}
                className={`feedtab${tab === x.key ? ' on' : ''}`}
                onClick={() => setTab(x.key)}
              >
                {x.label}
              </button>
            ))}
          </div>
          <span className="feedbar__count">{t.feed.count(posts.length)}</span>
        </div>

        {shown.length === 0 ? (
          <div className="empty">
            <h3>{t.feed.emptyTitle}</h3>
            <p>{t.feed.emptyLead}</p>
            <button className="btn btn--primary" onClick={onStart}>
              {t.feed.emptyBtn} <span className="arw">↘</span>
            </button>
          </div>
        ) : (
          <div className="feed">
            {shown.map((post, i) => (
              <article
                className="post"
                key={post.id}
                style={{ ['--d' as string]: `${Math.min(i, 8) * 50}ms` }}
              >
                <div className="post__top">
                  <div className="post__ava">{initials(post.author)}</div>
                  <div className="post__who">
                    <b>{post.author}</b>
                    <span>
                      {post.category} · {post.location}
                    </span>
                  </div>
                  <span className="post__rep">
                    +{post.rep} {t.social.rep}
                  </span>
                </div>

                <button
                  className="post__frame"
                  onClick={() => setLight(post)}
                  aria-label={t.modal.preview}
                >
                  <img
                    className="post__img"
                    src={post.image}
                    alt={post.caption || post.sceneTitle}
                  />
                  <span className="post__cam">◉ {t.social.cam}</span>
                  <span className="post__expand">⤢</span>
                </button>

                <div className="post__b">
                  <div className="post__acts">
                    <button
                      className={`act${post.liked ? ' liked' : ''}`}
                      onClick={() => onLike(post.id)}
                      aria-pressed={post.liked}
                    >
                      {post.liked ? '♥' : '♡'} {compact(post.likes)}
                    </button>
                    <span className="act act--static">💬 {compact(post.comments)}</span>
                    <button className="act" onClick={() => onRepost(post.id)}>
                      ⇄ {compact(post.reposts)}
                    </button>
                    <button className="act act--end" onClick={() => download(post)}>
                      ↓
                    </button>
                  </div>
                  {post.caption && (
                    <p className="post__cap">
                      <b>{post.author}</b> {renderCaption(post.caption)}
                    </p>
                  )}
                  <div className="post__time">{timeAgo(post.createdAt)}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      <Modal open={!!live} onClose={() => setLight(null)} wide label="Snap">
        {live && (
          <div className="light">
            <div className="light__img">
              <img src={live.image} alt={live.caption || live.sceneTitle} />
              <span className="post__cam">◉ {t.social.cam}</span>
            </div>
            <div className="light__body">
              <div className="post__top" style={{ padding: 0, marginBottom: 14 }}>
                <div className="post__ava">{initials(live.author)}</div>
                <div className="post__who">
                  <b>{live.author}</b>
                  <span>
                    {live.category} · {live.location}
                  </span>
                </div>
                <span className="post__rep">
                  +{live.rep} {t.social.rep}
                </span>
              </div>
              {live.caption && <p className="light__cap">{renderCaption(live.caption)}</p>}
              <div className="post__acts" style={{ marginTop: 18 }}>
                <button
                  className={`act${live.liked ? ' liked' : ''}`}
                  onClick={() => onLike(live.id)}
                >
                  {live.liked ? '♥' : '♡'} {compact(live.likes)}
                </button>
                <span className="act act--static">💬 {compact(live.comments)}</span>
                <button className="act" onClick={() => onRepost(live.id)}>
                  ⇄ {compact(live.reposts)}
                </button>
                <button className="act act--end" onClick={() => download(live)}>
                  ↓ {t.feed.save}
                </button>
              </div>
              <div className="post__time" style={{ marginTop: 14 }}>
                {timeAgo(live.createdAt)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

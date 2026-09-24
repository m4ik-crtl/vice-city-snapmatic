import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import EditorView from './components/EditorView';
import Feed from './components/Feed';
import Footer from './components/Footer';
import PostingOverlay from './components/PostingOverlay';
import { SCENES } from './data/scenes';
import { pick, type Post, type Scene } from './types';
import { useUI } from './ui';
import { useReveal } from './anim';

type View = 'home' | 'studio' | 'feed';

const REP_POST = 500;
const REP_LIKE = 10;
const REP_REPOST = 25;

const seedPosts = (): Post[] => [
  {
    id: 'seed-1',
    sceneId: 'squalo-sunset',
    sceneTitle: 'Cruise the Bay',
    location: 'Vice Beach',
    category: 'Boats',
    image: '/moments/squalo.webp',
    caption: 'skyline hitting different from the water tonight 🌆 #Squalo #ViceBeach #GTA6',
    author: 'Lucia_C',
    likes: 3412,
    liked: false,
    comments: 128,
    reposts: 212,
    rep: 500,
    trending: true,
    nearby: false,
    createdAt: Date.now() - 1000 * 60 * 42,
  },
  {
    id: 'seed-2',
    sceneId: 'the-keys',
    sceneTitle: 'Fly the Keys',
    location: 'Leonida Keys',
    category: 'Escape',
    image: '/moments/keys.webp',
    caption: 'took the seaplane out past the causeway ✈️ #LeonidaKeys #GTA6',
    author: 'Jason_D',
    likes: 1890,
    liked: false,
    comments: 64,
    reposts: 96,
    rep: 500,
    trending: true,
    nearby: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'seed-3',
    sceneId: 'ink-neon',
    sceneTitle: 'Ink & Neon',
    location: 'Little Havana',
    category: 'Night Life',
    image: '/moments/electricfang.webp',
    caption: 'fresh ink, whole crew out 🐯 #NightLife #LittleHavana #GTA6',
    author: 'Kira_Neon',
    likes: 5210,
    liked: false,
    comments: 301,
    reposts: 442,
    trending: true,
    nearby: true,
    rep: 500,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
];

export default function App() {
  const { t, lang } = useUI();
  const [view, setView] = useState<View>('home');
  useReveal(view);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [rep, setRep] = useState(2450);
  const [toast, setToast] = useState('');
  const [postingImage, setPostingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const pickScene = (scene: Scene) => {
    setActiveScene(scene);
    setView('studio');
    window.scrollTo({ top: 0 });
  };

  const goHome = () => {
    setActiveScene(null);
    setView('home');
    window.scrollTo({ top: 0 });
  };

  const goFeed = () => {
    setView('feed');
    window.scrollTo({ top: 0 });
  };

  const goAbout = () => {
    if (view !== 'home') {
      setActiveScene(null);
      setView('home');
    }
    setTimeout(
      () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }),
      60,
    );
  };

  const handlePost = (data: { image: string; caption: string; author: string }) => {
    if (!activeScene || postingImage) return;
    const scene = activeScene;
    setPostingImage(data.image); // shows the "developing" overlay
    window.setTimeout(() => {
      const newPost: Post = {
        id: crypto.randomUUID(),
        sceneId: scene.id,
        sceneTitle: scene.title.en,
        location: scene.location,
        category: pick(scene.category, lang),
        image: data.image,
        caption: data.caption,
        author: data.author,
        likes: 0,
        liked: false,
        comments: 0,
        reposts: 0,
        rep: REP_POST,
        trending: false,
        nearby: true,
        createdAt: Date.now(),
      };
      setPosts((cur) => [newPost, ...cur]);
      setRep((r) => r + REP_POST);
      setPostingImage(null);
      setActiveScene(null);
      setView('feed');
      setToast(t.social.repEarned(REP_POST));
      window.scrollTo({ top: 0 });
    }, 1700);
  };

  const like = (id: string) =>
    setPosts((cur) =>
      cur.map((p) => {
        if (p.id !== id) return p;
        const liked = !p.liked;
        setRep((r) => r + (liked ? REP_LIKE : -REP_LIKE));
        return { ...p, liked, likes: p.likes + (liked ? 1 : -1) };
      }),
    );

  const repost = (id: string) =>
    setPosts((cur) =>
      cur.map((p) => {
        if (p.id !== id) return p;
        setRep((r) => r + REP_REPOST);
        return { ...p, reposts: p.reposts + 1 };
      }),
    );

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="ambient__blob b1" />
        <span className="ambient__blob b2" />
        <span className="ambient__blob b3" />
        <span className="ambient__grid" />
        <span className="ambient__scan" />
      </div>

      <Nav
        view={view}
        feedCount={posts.length}
        rep={rep}
        onHome={goHome}
        onFeed={goFeed}
        onAbout={goAbout}
      />

      {view === 'home' && <Home onPick={pickScene} onFeed={goFeed} />}
      {view === 'studio' && activeScene && (
        <EditorView scene={activeScene} onBack={goHome} onPost={handlePost} />
      )}
      {view === 'feed' && (
        <Feed
          posts={posts}
          onLike={like}
          onRepost={repost}
          onStart={() => pickScene(SCENES[0])}
        />
      )}

      <Footer />

      {postingImage && <PostingOverlay image={postingImage} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

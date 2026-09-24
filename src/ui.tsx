import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'en' | 'pt';
export type Theme = 'dark' | 'light';

/* ---- dictionary --------------------------------------------------- */
export interface Dict {
  nav: { capture: string; feed: string; about: string };
  hero: {
    kicker: string;
    t1: string;
    t2: string;
    lead1: string;
    leadMuted: string;
    pill: string;
    cta1: string;
    cta2: string;
  };
  marqueeTail: string[];
  stats: { moments: string; tools: string; snaps: string; yours: string };
  moments: { kicker: string; t1: string; t2: string; note: string };
  studio: {
    back: string;
    title: string;
    panelTitle: string;
    panelLead: string;
    handle: string;
    handlePh: string;
    caption: string;
    hashtags: string;
    ready: string;
    saved: string;
    cancelled: string;
    decodeErr: string;
    loading: string;
    fallbackTitle: string;
    fallbackBody: string;
    postSaved: string;
    postCurrent: string;
    postAnyway: string;
    discard: string;
  };
  feed: {
    kicker: string;
    t1: string;
    t2: string;
    count: (n: number) => string;
    emptyTitle: string;
    emptyLead: string;
    emptyBtn: string;
    save: string;
    justNow: string;
    posted: string;
  };
  about: {
    kicker: string;
    t1: string;
    t2: string;
    lead: ReactNode;
    body: string;
    checklist: string[];
    role: string;
    linksLabel: string;
    portfolio: string;
  };
  footer: { t1: string; t2: string; disclaimer: string };
  social: {
    tabAll: string;
    tabTrending: string;
    tabNearby: string;
    rep: string;
    level: string;
    comments: string;
    reposts: string;
    cam: string;
    repEarned: (n: number) => string;
  };
  spot: { kicker: string; live: string; open: string; prev: string; next: string };
  modal: { open: string; close: string; preview: string };
  upload: { title: string; hint: string };
  posting: string;
  custom: { title: string; location: string; category: string; blurb: string };
}

const EN: Dict = {
  nav: { capture: 'Capture', feed: 'Feed', about: 'About' },
  hero: {
    kicker: 'VICE CITY SNAPMATIC',
    t1: 'Shoot Leonida.',
    t2: 'Make it yours.',
    lead1:
      'Pick a moment from the streets of Leonida, drop into the studio, and edit the shot — crop, filter, text, stickers, frames. ',
    leadMuted: 'Then post it to the feed. What do you want to see in GTA VI?',
    pill: 'BUILT WITH REACT IMAGE EDITOR',
    cta1: 'Start shooting',
    cta2: 'View the feed',
  },
  marqueeTail: ['#BUILTWITHIMAGEEDITOR', '#GTA6', 'LEONIDA', 'SNAPMATIC'],
  stats: {
    moments: 'Moments to shoot',
    tools: 'Editing tools',
    snaps: 'Snaps you can make',
    yours: 'Yours to keep',
  },
  moments: {
    kicker: 'CHOOSE A MOMENT',
    t1: 'Every corner.',
    t2: 'One camera.',
    note: 'Every moment opens in the editor.',
  },
  studio: {
    back: 'Back to moments',
    title: 'The Studio',
    panelTitle: 'Post your snap',
    panelLead:
      'Edit the shot on the left. When it looks right, tag it and drop it in the Vice City feed.',
    handle: 'Handle',
    handlePh: 'your handle',
    caption: 'Caption',
    hashtags: 'Hashtags',
    ready: 'Editor ready — crop, filter, add text, stickers & frames.',
    saved: 'Saved. Add a caption and post it to the feed.',
    cancelled: 'Edit cancelled — your last save is still here.',
    decodeErr: 'Could not decode the image. Try another moment.',
    loading: 'Loading the editor from Unlayer’s CDN…',
    fallbackTitle: 'Editor couldn’t load',
    fallbackBody:
      'The React Image Editor loads its toolkit from Unlayer’s CDN, so it needs an internet connection. You can still post this shot — reconnect and reopen to edit.',
    postSaved: 'Post to feed',
    postCurrent: 'Post current shot',
    postAnyway: 'Post it anyway',
    discard: 'Discard',
  },
  feed: {
    kicker: 'THE FEED',
    t1: 'Fresh off',
    t2: 'Ocean Drive.',
    count: (n) => `${n} ${n === 1 ? 'snap' : 'snaps'} posted`,
    emptyTitle: 'No snaps yet',
    emptyLead: 'Head back, pick a moment, and edit your first shot.',
    emptyBtn: 'Take a snap',
    save: 'Save',
    justNow: 'just now',
    posted: 'Posted to the Vice City feed',
  },
  about: {
    kicker: 'ABOUT THIS BUILD',
    t1: 'Editorial meets',
    t2: 'Vice City.',
    lead: (
      <>
        A GTA VI photo app where the <span className="accent">React Image Editor</span> is
        the whole point — every moment opens in it.
      </>
    ),
    body:
      'The layout borrows the editorial system from my portfolio — hairline grid, mono labels, numbered sections, marquee — and reskins it in Vice City neon. Built for the Build with React Image Editor challenge.',
    checklist: [
      'GTA VI-inspired experience',
      'React Image Editor at the core',
      'Users edit at least one visual',
      'Public GitHub repo + deploy ready',
      'Day / night · EN / PT',
    ],
    role: 'Data Analyst & Automation Developer · São Paulo',
    linksLabel: 'LINKS',
    portfolio: 'Portfolio',
  },
  footer: {
    t1: 'What do you want',
    t2: 'to see in GTA VI?',
    disclaimer:
      'Fan project · not affiliated with Rockstar Games · imagery © Rockstar Games',
  },
  social: {
    tabAll: 'Latest',
    tabTrending: 'Trending',
    tabNearby: 'Nearby',
    rep: 'REP',
    level: 'LV',
    comments: 'comments',
    reposts: 'reposts',
    cam: 'SNAPMATIC CAM',
    repEarned: (n) => `+${n} REP · posted to the feed`,
  },
  spot: {
    kicker: 'SPOTLIGHT',
    live: 'LIVE NOW',
    open: 'Shoot this',
    prev: 'Previous',
    next: 'Next',
  },
  modal: { open: 'Open in Studio', close: 'Close', preview: 'Preview' },
  upload: { title: 'Use your own', hint: 'JPG · PNG · WEBP' },
  posting: 'Posting to the feed',
  custom: {
    title: 'Your Shot',
    location: 'Your Camera',
    category: 'Custom',
    blurb: 'Your own image, your rules.',
  },
};

const PT: Dict = {
  nav: { capture: 'Capturar', feed: 'Feed', about: 'Sobre' },
  hero: {
    kicker: 'VICE CITY SNAPMATIC',
    t1: 'Fotografe Leonida.',
    t2: 'Deixe do seu jeito.',
    lead1:
      'Escolha um momento nas ruas de Leonida, entre no estúdio e edite a foto — corte, filtro, texto, stickers, molduras. ',
    leadMuted: 'Depois poste no feed. O que você quer ver em GTA VI?',
    pill: 'FEITO COM REACT IMAGE EDITOR',
    cta1: 'Começar a fotografar',
    cta2: 'Ver o feed',
  },
  marqueeTail: ['#BUILTWITHIMAGEEDITOR', '#GTA6', 'LEONIDA', 'SNAPMATIC'],
  stats: {
    moments: 'Momentos pra fotografar',
    tools: 'Ferramentas de edição',
    snaps: 'Fotos que dá pra fazer',
    yours: 'Suas pra guardar',
  },
  moments: {
    kicker: 'ESCOLHA UM MOMENTO',
    t1: 'Cada esquina.',
    t2: 'Uma câmera.',
    note: 'Cada momento abre no editor.',
  },
  studio: {
    back: 'Voltar aos momentos',
    title: 'O Estúdio',
    panelTitle: 'Poste sua foto',
    panelLead:
      'Edite a foto à esquerda. Quando ficar boa, marque as hashtags e jogue no feed de Vice City.',
    handle: 'Perfil',
    handlePh: 'seu @',
    caption: 'Legenda',
    hashtags: 'Hashtags',
    ready: 'Editor pronto — corte, filtro, texto, stickers e molduras.',
    saved: 'Salvo. Adicione uma legenda e poste no feed.',
    cancelled: 'Edição cancelada — o último salvamento continua aqui.',
    decodeErr: 'Não deu pra carregar a imagem. Tente outro momento.',
    loading: 'Carregando o editor pelo CDN da Unlayer…',
    fallbackTitle: 'O editor não carregou',
    fallbackBody:
      'O React Image Editor carrega o kit dele pelo CDN da Unlayer, então precisa de internet. Você ainda pode postar esta foto — reconecte e reabra para editar.',
    postSaved: 'Postar no feed',
    postCurrent: 'Postar foto atual',
    postAnyway: 'Postar mesmo assim',
    discard: 'Descartar',
  },
  feed: {
    kicker: 'O FEED',
    t1: 'Direto da',
    t2: 'Ocean Drive.',
    count: (n) => `${n} ${n === 1 ? 'foto postada' : 'fotos postadas'}`,
    emptyTitle: 'Nenhuma foto ainda',
    emptyLead: 'Volte, escolha um momento e edite a sua primeira foto.',
    emptyBtn: 'Tirar uma foto',
    save: 'Baixar',
    justNow: 'agora',
    posted: 'Postado no feed de Vice City',
  },
  about: {
    kicker: 'SOBRE ESTE PROJETO',
    t1: 'Editorial encontra',
    t2: 'Vice City.',
    lead: (
      <>
        Um app de fotos de GTA VI onde o{' '}
        <span className="accent">React Image Editor</span> é o centro de tudo — cada
        momento abre nele.
      </>
    ),
    body:
      'O layout usa o sistema editorial do meu portfólio — grade fina, labels em mono, seções numeradas, marquee — e reveste tudo com o neon de Vice City. Feito para o desafio Build with React Image Editor.',
    checklist: [
      'Experiência inspirada em GTA VI',
      'React Image Editor no centro',
      'Usuário edita ao menos um visual',
      'Repo público + pronto pra deploy',
      'Dia / noite · EN / PT',
    ],
    role: 'Analista de Dados & Automação · São Paulo',
    linksLabel: 'LINKS',
    portfolio: 'Portfólio',
  },
  footer: {
    t1: 'O que você quer',
    t2: 'ver em GTA VI?',
    disclaimer:
      'Projeto de fã · sem vínculo com a Rockstar Games · imagens © Rockstar Games',
  },
  social: {
    tabAll: 'Recentes',
    tabTrending: 'Em alta',
    tabNearby: 'Por perto',
    rep: 'REP',
    level: 'NÍVEL',
    comments: 'comentários',
    reposts: 'reposts',
    cam: 'SNAPMATIC CAM',
    repEarned: (n) => `+${n} REP · postado no feed`,
  },
  spot: {
    kicker: 'DESTAQUE',
    live: 'AO VIVO',
    open: 'Fotografar',
    prev: 'Anterior',
    next: 'Próximo',
  },
  modal: { open: 'Abrir no Estúdio', close: 'Fechar', preview: 'Prévia' },
  upload: { title: 'Usar imagem própria', hint: 'JPG · PNG · WEBP' },
  posting: 'Postando no feed',
  custom: {
    title: 'Sua Foto',
    location: 'Sua Câmera',
    category: 'Própria',
    blurb: 'Sua imagem, suas regras.',
  },
};

const DICTS: Record<Lang, Dict> = { en: EN, pt: PT };

/* ---- context ------------------------------------------------------ */
interface UIState {
  theme: Theme;
  lang: Lang;
  t: Dict;
  toggleTheme: () => void;
  toggleLang: () => void;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Vice City nights by default
  const [lang, setLang] = useState<Lang>('en'); // English primary

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  }, [lang]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  );
  const toggleLang = useCallback(
    () => setLang((l) => (l === 'en' ? 'pt' : 'en')),
    [],
  );

  const value = useMemo<UIState>(
    () => ({ theme, lang, t: DICTS[lang], toggleTheme, toggleLang }),
    [theme, lang, toggleTheme, toggleLang],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIState {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}

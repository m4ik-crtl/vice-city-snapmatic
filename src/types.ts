import type { Lang } from './ui';

export interface Loc {
  en: string;
  pt: string;
}

export interface Scene {
  id: string;
  title: Loc;
  location: string;
  category: Loc;
  blurb: Loc;
  image: string;
  accent: string;
  tags: string[];
}

export const pick = (l: Loc, lang: Lang): string => l[lang];

export interface Post {
  id: string;
  sceneId: string;
  sceneTitle: string;
  location: string;
  category: string;
  image: string;
  caption: string;
  author: string;
  likes: number;
  liked: boolean;
  comments: number;
  reposts: number;
  rep: number;
  /** 'trending' | 'nearby' | flags used by the feed filters. */
  trending?: boolean;
  nearby?: boolean;
  createdAt: number;
}

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bodyMd: string;
  icon: string;
  orderIndex: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bodyMd: string;
  category: 'orientacao' | 'educativo' | 'aviso';
  coverUrl: string | null;
  author: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answerMd: string;
  category: string;
  orderIndex: number;
};

export type TeamMember = {
  id: string;
  name: string;
  roleTitle: string;
  bio: string;
  photoUrl: string | null;
  orderIndex: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  isAnonymous: boolean;
  handledAt: string | null;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLoginAt: string | null;
};

export type AdminSummary = {
  totals: {
    services: number;
    posts: number;
    messagesUnhandled: number;
    viewsLast7d: number;
  };
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type HomeHighlights = {
  featuredServices: Service[];
  recentPosts: Post[];
  bannerText: string;
};

export type AboutContent = {
  title: string;
  bodyMd: string;
};

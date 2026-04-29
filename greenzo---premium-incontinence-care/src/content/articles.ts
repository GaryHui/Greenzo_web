import type { Language } from '../translations';

import guanzhongValueZh from './articles/guanzhong-value.zh.md?raw';
import guanzhongValueHk from './articles/guanzhong-value.hk.md?raw';
import guanzhongValueEn from './articles/guanzhong-value.en.md?raw';
import guanzhongValueJa from './articles/guanzhong-value.ja.md?raw';

export type KnowledgeArticle = {
  slug: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  markdown: Record<Language, string>;
  publishedAt: string;
};

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    slug: 'guanzhong-value',
    title: {
      zh: '好而不贵的成人纸尿片如何选？',
      hk: '如何揀到「好而不貴」的成人紙尿片？',
      en: 'How To Choose Better-Value Adult Diapers',
      ja: 'コストと品質を両立する選び方',
    },
    summary: {
      zh: '从产地、吸锁、透气、防漏与标准检测，系统解读长期护理家庭的选购重点。',
      hk: '由產地、吸收、防漏與標準檢測切入，整理長期護理家庭的實際選購重點。',
      en: 'A practical guide to origin, absorbency, breathability, leak protection, and quality standards for long-term care.',
      ja: '産地・吸収・通気・漏れ対策・基準検査の観点から、長期介護向けの選び方を解説。',
    },
    markdown: {
      zh: guanzhongValueZh,
      hk: guanzhongValueHk,
      en: guanzhongValueEn,
      ja: guanzhongValueJa,
    },
    publishedAt: '2026-04-29',
  },
];

export function findKnowledgeArticle(slug: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find((article) => article.slug === slug);
}

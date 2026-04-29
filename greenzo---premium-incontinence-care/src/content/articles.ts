import type { Language } from '../translations';

import guanzhongValueZh from './articles/guanzhong-value.zh.md?raw';
import guanzhongValueHk from './articles/guanzhong-value.hk.md?raw';
import guanzhongValueEn from './articles/guanzhong-value.en.md?raw';
import guanzhongValueJa from './articles/guanzhong-value.ja.md?raw';
import guanzhongMiit2022Zh from './articles/guanzhong-miit-2022.zh.md?raw';
import guanzhongMiit2022Hk from './articles/guanzhong-miit-2022.hk.md?raw';
import guanzhongMiit2022En from './articles/guanzhong-miit-2022.en.md?raw';
import guanzhongMiit2022Ja from './articles/guanzhong-miit-2022.ja.md?raw';
import guanzhongBrandOriginReview2026Zh from './articles/guanzhong-brand-origin-review-2026.zh.md?raw';
import guanzhongBrandOriginReview2026Hk from './articles/guanzhong-brand-origin-review-2026.hk.md?raw';
import guanzhongBrandOriginReview2026En from './articles/guanzhong-brand-origin-review-2026.en.md?raw';
import guanzhongBrandOriginReview2026Ja from './articles/guanzhong-brand-origin-review-2026.ja.md?raw';

import whyChooseGreenzoZh from './articles/why-choose-greenzo.zh.md?raw';
import whyChooseGreenzoHk from './articles/why-choose-greenzo.hk.md?raw';
import whyChooseGreenzoEn from './articles/why-choose-greenzo.en.md?raw';
import whyChooseGreenzoJa from './articles/why-choose-greenzo.ja.md?raw';

export type KnowledgeArticle = {
  slug: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  markdown: Record<Language, string>;
  publishedAt: string;
};

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    slug: 'guanzhong-miit-2022',
    title: {
      zh: '莞众便盆、便壶入选工信部《2022年老年用品产品推广目录》',
      hk: '莞眾便盆、便壺入選《2022年老年用品產品推廣目錄》',
      en: 'Guanzhong Bedpans And Urinals Listed In 2022 Directory',
      ja: '莞衆の便器・尿器が2022年高齢者用品目録に選定',
    },
    summary: {
      zh: '从权威入选背景到产品适老化细节，解读莞众便盆、便壶如何兼顾安全、实用与长期性价比。',
      hk: '由權威入選背景到適老化細節，說明莞眾便盆、便壺的安全與實用價值。',
      en: 'An overview of official listing background, product practicality, and quality control value in elderly care.',
      ja: '公的掲載の背景と、介護現場での実用性・品質管理のポイントを解説。',
    },
    markdown: {
      zh: guanzhongMiit2022Zh,
      hk: guanzhongMiit2022Hk,
      en: guanzhongMiit2022En,
      ja: guanzhongMiit2022Ja,
    },
    publishedAt: '2026-04-29',
  },
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
  {
    slug: 'guanzhong-brand-origin-review-2026',
    title: {
      zh: '莞众品牌出处与用户评价（2022-2026）：口碑、优劣与适用建议',
      hk: '莞眾品牌出處與用戶評價（2022-2026）：口碑、優劣與適用建議',
      en: 'Guanzhong Brand Origin And User Reviews (2022-2026)',
      ja: '莞衆ブランドの出所とユーザー評価（2022-2026）',
    },
    summary: {
      zh: '从品牌出处、平台评价到适用人群，梳理莞众成人护理产品在性价比、吸收防漏与使用场景上的真实表现。',
      hk: '由品牌出處、平台評價到適用人群，梳理莞眾成人護理產品在性價比、吸收防漏與使用場景上的真實表現。',
      en: 'From brand origin and platform reviews to user scenarios, this article summarizes the practical performance of Guanzhong adult-care products.',
      ja: 'ブランドの出所・各プラットフォーム評価・適用人群を整理し、莞衆成人ケア製品の実用的な評価をまとめます。',
    },
    markdown: {
      zh: guanzhongBrandOriginReview2026Zh,
      hk: guanzhongBrandOriginReview2026Hk,
      en: guanzhongBrandOriginReview2026En,
      ja: guanzhongBrandOriginReview2026Ja,
    },
    publishedAt: '2026-04-29',
  },  {
    slug: 'why-choose-greenzo',
    title: {
      zh: '用莞众，劲轻松',
      hk: '用莞眾，勁輕鬆',
      en: 'Use Wanzhong, the strength is relaxed',
      ja: '万中を使用すると、力が緩和されます',
    },
    summary: {
      zh: '选莞众成人尿片，享护理劲轻松',
      hk: '選莞眾成人尿片，享護理勁輕鬆',
      en: 'Choose Wanzhong adult diapers and enjoy easy care',
      ja: 'Wanzhong の大人用おむつを選んで簡単なお手入れをお楽しみください',
    },
    markdown: {
      zh: whyChooseGreenzoZh,
      hk: whyChooseGreenzoHk,
      en: whyChooseGreenzoEn,
      ja: whyChooseGreenzoJa,
    },
    publishedAt: '2026-04-29',
  },

];

export function findKnowledgeArticle(slug: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find((article) => article.slug === slug);
}

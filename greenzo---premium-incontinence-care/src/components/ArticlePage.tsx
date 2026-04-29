import { useMemo } from 'react';
import { ASSET_CONFIG, type ProductCatalogItem } from '../assets';
import { findKnowledgeArticle } from '../content/articles';
import { useLanguageStore } from '../translations';
import { MarkdownRenderer } from './MarkdownRenderer';

function pickLocalizedText(
  value: unknown,
  language: string,
  fallbackLanguage = 'zh',
): string | undefined {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const preferred = record[language];
  if (typeof preferred === 'string') return preferred;
  const fallback = record[fallbackLanguage];
  if (typeof fallback === 'string') return fallback;
  const first = Object.values(record).find((v) => typeof v === 'string');
  return typeof first === 'string' ? first : undefined;
}

export default function ArticlePage({ slug }: { slug: string }) {
  const { language } = useLanguageStore();
  const article = findKnowledgeArticle(slug);
  const isBedpanArticle = slug === 'guanzhong-miit-2022';

  const relatedGallery = useMemo(() => {
    const catalog = (ASSET_CONFIG.productCatalog ?? []) as ProductCatalogItem[];
    const targetSubCategory = isBedpanArticle ? 'urinal' : 'diaper';
    return catalog
      .filter((item) => item.mainCategory === 'Adult' && item.subCategory === targetSubCategory)
      .flatMap((item) =>
        (item.images ?? []).slice(0, 1).map((image) => ({
          src: image.src,
          caption:
            pickLocalizedText(image.caption, language) ||
            pickLocalizedText(item.name, language) ||
            'Diaper',
        })),
      )
      .slice(0, 3);
  }, [language, isBedpanArticle]);

  if (!article) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-brand-dark text-xl font-serif">
            {language === 'zh' && '文章不存在'}
            {language === 'hk' && '文章不存在'}
            {language === 'en' && 'Article not found'}
            {language === 'ja' && '記事が見つかりません'}
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 border border-black/10 text-[11px] uppercase tracking-[0.2em] font-bold text-black/60 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all"
          >
            {language === 'zh' && '返回首页'}
            {language === 'hk' && '返回首頁'}
            {language === 'en' && 'Back Home'}
            {language === 'ja' && 'ホームへ戻る'}
          </a>
        </div>
      </div>
    );
  }

  const markdown = article.markdown[language] || article.markdown.zh;

  return (
    <div className="min-h-screen bg-brand-cream">
      <main className="pt-28 md:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/articles"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] font-bold text-black/45 hover:text-brand-green transition-colors"
            >
              <span>←</span>
              <span>
                {language === 'zh' && '返回专栏'}
                {language === 'hk' && '返回專欄'}
                {language === 'en' && 'Back to Hub'}
                {language === 'ja' && '記事一覧へ戻る'}
              </span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-black/35 hover:text-brand-green transition-colors"
            >
              <span>
                {language === 'zh' && '返回首页'}
                {language === 'hk' && '返回首頁'}
                {language === 'en' && 'Back Home'}
                {language === 'ja' && 'ホームへ戻る'}
              </span>
            </a>
          </div>

          <article className="mt-8 bg-white/70 border border-black/10 p-6 md:p-10 lg:p-12">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green">
              Care Knowledge
            </div>
            <div className="mt-8">
              <MarkdownRenderer markdown={markdown} />
            </div>
          </article>

          {isBedpanArticle && (
            <div className="mt-8">
              <a
                href="/?main=Adult&sub=urinal&product=adult-urinal-bedpan#products"
                className="inline-flex items-center gap-2 px-6 py-3 border border-black/10 bg-white/70 text-[10px] uppercase tracking-[0.24em] font-bold text-black/60 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all"
              >
                <span>
                  {language === 'zh' && '进入产品中心 · 便盆便壶'}
                  {language === 'hk' && '進入產品中心 · 便盆便壺'}
                  {language === 'en' && 'Open Product Center · Bedpan & Urinal'}
                  {language === 'ja' && '製品センターへ · 便盆・尿器'}
                </span>
              </a>
            </div>
          )}

          {relatedGallery.length > 0 && (
            <section className="mt-10 md:mt-14">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-4">
                {isBedpanArticle && language === 'zh' && '配图图集 · 便盆便壶'}
                {isBedpanArticle && language === 'hk' && '配圖圖集 · 便盆便壺'}
                {isBedpanArticle && language === 'en' && 'Related Gallery · Bedpan & Urinal'}
                {isBedpanArticle && language === 'ja' && '関連ギャラリー · 便盆・尿器'}
                {!isBedpanArticle && language === 'zh' && '配图图集 · 成人纸尿裤'}
                {!isBedpanArticle && language === 'hk' && '配圖圖集 · 成人紙尿褲'}
                {!isBedpanArticle && language === 'en' && 'Related Gallery · Adult Diaper'}
                {!isBedpanArticle && language === 'ja' && '関連ギャラリー · 成人用おむつ'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedGallery.map((image) => (
                  <figure
                    key={`${image.src}-${image.caption}`}
                    className="border border-black/10 bg-white/70 p-3"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.caption}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 text-[11px] tracking-[0.12em] uppercase text-black/55 font-bold">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

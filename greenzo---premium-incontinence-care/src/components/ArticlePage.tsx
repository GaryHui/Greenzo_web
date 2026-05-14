import { useEffect } from 'react';
import { findKnowledgeArticle } from '../content/articles';
import { useLanguageStore } from '../translations';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ShareActions } from './ShareActions';

export default function ArticlePage({ slug }: { slug: string }) {
  const { language } = useLanguageStore();
  const article = findKnowledgeArticle(slug);
  const articleTitle = article ? article.title[language] || article.title.zh : '';
  const articleSummary = article ? article.summary[language] || article.summary.zh : '';
  const markdown = article ? article.markdown[language] || article.markdown.zh : '';

  useEffect(() => {
    if (!article) return;
    document.title = `${articleTitle} | Greenzo`;
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = articleSummary;
  }, [article, articleSummary, articleTitle]);

  if (!article) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-brand-dark text-xl font-serif">
            {language === 'en' ? 'Article not found' : '文章不存在'}
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 border border-black/10 text-[11px] uppercase tracking-[0.2em] font-bold text-black/60 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all"
          >
            {language === 'en' ? 'Back Home' : '返回首页'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <main className="pt-24 md:pt-28 pb-14 md:pb-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/articles"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] font-bold text-black/45 hover:text-brand-green transition-colors"
            >
              <span>&larr;</span>
              <span>{language === 'en' ? 'Back to Hub' : '返回专栏'}</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-black/35 hover:text-brand-green transition-colors"
            >
              <span>{language === 'en' ? 'Back Home' : '返回首页'}</span>
            </a>
          </div>

          <article className="mt-7 bg-white/75 border border-black/10 p-5 sm:p-6 md:p-10 lg:p-12">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green">
              Care Knowledge
            </div>
            <h1 className="mt-5 text-3xl md:text-4xl font-serif text-brand-dark leading-tight">
              {articleTitle}
            </h1>
            <p className="mt-4 text-black/60 leading-relaxed max-w-3xl">
              {articleSummary}
            </p>
            <ShareActions article={article} language={language} />
            <div className="mt-8">
              <MarkdownRenderer markdown={markdown} />
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

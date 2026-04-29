import { motion } from 'motion/react';
import { KNOWLEDGE_ARTICLES } from '../content/articles';
import { useLanguageStore } from '../translations';

export default function ArticlesHomePage() {
  const { language } = useLanguageStore();

  return (
    <div className="min-h-screen bg-brand-cream">
      <main className="pt-28 md:pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] font-bold text-black/45 hover:text-brand-green transition-colors"
          >
            <span>←</span>
            <span>
              {language === 'zh' && '返回首页'}
              {language === 'hk' && '返回首頁'}
              {language === 'en' && 'Back to Home'}
              {language === 'ja' && 'ホームに戻る'}
            </span>
          </a>

          <section className="mt-8 border border-black/10 bg-white/65 p-6 md:p-10 lg:p-12">
            <div className="text-[10px] uppercase tracking-[0.34em] font-bold text-brand-green mb-4">
              Care Insights
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-brand-dark leading-tight max-w-4xl">
              {language === 'zh' && '莞众小知识 · 护理文章主页面'}
              {language === 'hk' && '莞眾小知識 · 護理文章主頁'}
              {language === 'en' && 'Greenzo Care Knowledge Hub'}
              {language === 'ja' && '莞衆 ケア知識ハブ'}
            </h1>
            <p className="mt-4 text-black/60 max-w-3xl leading-relaxed">
              {language === 'zh' && '围绕失禁护理、家庭照护与产品选型，持续更新可读、可用、可落地的科普内容。'}
              {language === 'hk' && '圍繞失禁護理、家庭照護與產品選型，持續更新實用型科普內容。'}
              {language === 'en' && 'Practical articles on incontinence care, family caregiving, and product selection.'}
              {language === 'ja' && '失禁ケア・在宅介護・製品選定に関する実用的な記事を継続更新します。'}
            </p>
          </section>

          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {KNOWLEDGE_ARTICLES.map((article) => (
              <motion.a
                key={article.slug}
                href={`/articles/${article.slug}`}
                whileHover={{ y: -4 }}
                className="group border border-black/10 bg-white/70 p-6 md:p-7 hover:border-brand-green/30 hover:shadow-lg transition-all"
              >
                <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-black/40">
                  {article.publishedAt}
                </div>
                <h2 className="mt-3 text-2xl font-serif text-brand-dark leading-tight group-hover:text-brand-green transition-colors">
                  {article.title[language]}
                </h2>
                <p className="mt-4 text-black/65 leading-relaxed">{article.summary[language]}</p>
                <div className="mt-5 text-[11px] uppercase tracking-[0.24em] font-bold text-brand-green">
                  {language === 'zh' && '点击阅读'}
                  {language === 'hk' && '點擊閱讀'}
                  {language === 'en' && 'Open Article'}
                  {language === 'ja' && '記事を開く'}
                </div>
              </motion.a>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

import { motion } from 'motion/react';
import { KNOWLEDGE_ARTICLES } from '../content/articles';
import { useLanguageStore } from '../translations';

export default function KnowledgeSection() {
  const { language } = useLanguageStore();
  const article = KNOWLEDGE_ARTICLES[0];

  return (
    <section id="knowledge" className="py-20 md:py-28 bg-brand-cream border-t border-black/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-green mb-4">
          Care Insights
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-brand-dark leading-tight max-w-3xl">
          {language === 'zh' && '护理科普与软文专栏'}
          {language === 'hk' && '護理科普與內容專欄'}
          {language === 'en' && 'Knowledge & Care Articles'}
          {language === 'ja' && 'ケア知識・コラム'}
        </h2>
        <p className="mt-4 text-black/60 max-w-2xl leading-relaxed">
          {language === 'zh' && '沉淀真实护理经验，帮助家庭做出更稳妥的长期护理选择。'}
          {language === 'hk' && '整理真實護理經驗，幫助家庭作出更穩妥的長期照護選擇。'}
          {language === 'en' && 'Practical reading for families making safer long-term care decisions.'}
          {language === 'ja' && '長期ケアの判断に役立つ、実用的な知識記事をまとめています。'}
        </p>

        <motion.a
          href={`/articles/${article.slug}`}
          whileHover={{ y: -2 }}
          className="mt-10 block border border-black/10 bg-white/70 p-6 md:p-8 transition-all hover:shadow-lg hover:border-brand-green/30"
        >
          <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-black/40">
            {article.publishedAt}
          </div>
          <h3 className="mt-3 text-2xl md:text-3xl font-serif text-brand-dark leading-tight">
            {article.title[language]}
          </h3>
          <p className="mt-4 text-black/65 leading-relaxed max-w-3xl">
            {article.summary[language]}
          </p>
          <div className="mt-6 text-[11px] uppercase tracking-[0.24em] font-bold text-brand-green">
            {language === 'zh' && '阅读全文'}
            {language === 'hk' && '閱讀全文'}
            {language === 'en' && 'Read Article'}
            {language === 'ja' && '全文を読む'}
          </div>
        </motion.a>
      </div>
    </section>
  );
}

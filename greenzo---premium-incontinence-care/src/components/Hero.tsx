import { useLanguageStore, translations } from '../translations';
import { motion } from 'motion/react';
import { ASSET_CONFIG } from '../assets';

export default function Hero() {
  const { language } = useLanguageStore();
  const t = translations[language].hero;

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-brand-cream">
      {/* Background Decorative Elements */}
      <div className="absolute -left-12 top-48 text-[240px] font-bold text-black/[0.02] leading-none select-none pointer-events-none uppercase">
        Care
      </div>
      
      {/* Vertical Rail Text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-12 pointer-events-none">
        <div className="w-px h-24 bg-black/10"></div>
        <div className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-black/20">
          Purity • Dignity • Simplicity
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 md:px-16 grid md:grid-cols-12 gap-12 items-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 lg:col-span-5"
        >
          <div className="text-[10px] font-sans uppercase tracking-[0.5em] text-brand-green mb-8 font-bold">
            Redefining Personal Care • World-Class Standards
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-brand-dark leading-[0.95] mb-10 font-extralight tracking-tighter">
            {t.title.split(' ').map((word, i) => (
              <span key={i} className={word === 'Comfort' || word === 'Dignity' || word === '舒适' || word === '尊严' || word === '心地' ? 'italic text-brand-green' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-sm leading-relaxed text-black/60 max-w-sm font-sans mb-14 tracking-wide">
            {t.subtitle}
          </p>
          <div className="flex items-center gap-10">
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 bg-brand-green text-white text-[10px] uppercase tracking-[0.3em] font-sans font-bold hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-500"
            >
              {t.cta}
            </button>
            <div 
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[10px] font-sans border-b border-black/40 pb-1 cursor-pointer font-bold tracking-[0.2em] hover:text-brand-green hover:border-brand-green transition-all"
            >
              GALLERY
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="md:col-span-6 lg:col-span-7 flex justify-end"
        >
          <div className="relative w-full max-w-[500px]">
            <div className="aspect-[4/5] bg-brand-muted rounded-none overflow-hidden group shadow-sm border border-black/5">
              <img 
                src={ASSET_CONFIG.hero.mainImage} 
                alt="Soft care"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
              />
            </div>
            {/* Minimalist Accent Box */}
            <div className="absolute -bottom-10 -left-10 bg-brand-cream border border-black/5 p-10 shadow-sm max-w-[280px] hidden lg:block">
              <p className="text-brand-dark font-serif italic text-xl leading-snug">"{t.quote}"</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

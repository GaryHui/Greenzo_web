import { useLanguageStore, translations } from '../translations';
import { motion } from 'motion/react';
import { Building2, Users2, ShoppingBag } from 'lucide-react';
import { ASSET_CONFIG } from '../assets';

export default function BrandStory() {
  const { language } = useLanguageStore();
  const t = translations[language].story;
  const tc = translations[language].channels;

  return (
    <section id="story" className="py-20 md:py-32 bg-brand-cream relative overflow-hidden border-t border-black/5">
      {/* Decorative text watermark */}
      <div className="absolute -right-24 top-40 hidden lg:block text-[200px] font-bold text-black/[0.02] select-none whitespace-nowrap pointer-events-none rotate-90 uppercase">
        HISTORY
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 border-t border-l border-black/10" />
            <div className="aspect-[4/5] bg-brand-muted relative border border-black/5 shadow-sm overflow-hidden">
              <img 
                src={ASSET_CONFIG.brand.story} 
                alt="Professional care"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-[0.4]"
              />
              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-brand-green/35 backdrop-blur-md text-white px-5 py-4 md:p-8 md:pr-12 shadow-xl border border-white/20">
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif block mb-1">20+</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">{t.experience}</span>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.4em] text-brand-green font-bold mb-6">Our Legacy</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-dark mb-6 md:mb-10 leading-tight">
              {t.title}
            </h2>
            <div className="space-y-6 md:space-y-8 text-base md:text-lg text-black/70 font-light leading-relaxed font-sans max-w-2xl">
              <p>{t.content1}</p>
              <p>{t.content2}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-8 md:pt-10 border-t border-black/5 mt-8 md:mt-10">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-serif text-brand-green mb-1"
                >
                  {t.milestone}
                </motion.div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">{t.milestoneDesc}</div>
              </div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-serif text-brand-dark mb-1"
                >
                  {t.trust}
                </motion.div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">{t.experience}</div>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-black/5">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-10 flex items-center gap-4 text-black/40">
                <div className="w-12 h-px bg-black/10" />
                {tc.title}
              </h3>
              <p className="text-sm text-black/50 mb-10 font-sans italic max-w-lg leading-relaxed">
                {tc.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['CVS', 'OTC', 'Hospital', 'Elderly Care', 'E-commerce'].map((channel) => (
                  <div key={channel} className="bg-brand-muted p-4 text-center text-[10px] font-bold border border-black/5 uppercase tracking-widest text-black/60 hover:bg-brand-green hover:text-white transition-all cursor-default">
                    {channel}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

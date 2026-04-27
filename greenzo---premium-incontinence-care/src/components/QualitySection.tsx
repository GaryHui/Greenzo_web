import { useLanguageStore, translations } from '../translations';
import { motion } from 'motion/react';
import { Wind, Waves, Fingerprint } from 'lucide-react';

export default function QualitySection() {
  const { language } = useLanguageStore();
  const t = (translations[language] as any).quality;

  if (!t) return null;

  const features = [
    { icon: Waves, title: t.feature1, desc: t.feature1Desc },
    { icon: Wind, title: t.feature2, desc: t.feature2Desc },
    { icon: Fingerprint, title: t.feature3, desc: t.feature3Desc },
  ];

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-brand-muted border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 lg:gap-20 items-center">
          <div className="lg:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.5em] text-brand-green font-bold mb-6">Uncompromising Quality</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-dark mb-6 md:mb-8 leading-tight tracking-tighter">
              {t.title}
            </h2>
            <p className="text-sm text-black/50 font-sans leading-relaxed tracking-wide mb-12 max-w-sm">
              {t.subtitle}
            </p>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-3 gap-5 md:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-brand-cream border border-black/5 p-6 sm:p-8 md:p-10 flex flex-col items-center text-center group hover:bg-brand-green transition-all duration-700 cursor-default"
              >
                <f.icon className="w-8 h-8 text-brand-green mb-8 group-hover:text-white transition-colors duration-700 stroke-[1.5px]" />
                <h3 className="text-lg sm:text-xl font-serif text-brand-dark mb-4 group-hover:text-white transition-colors duration-700">{f.title}</h3>
                <p className="text-[11px] text-black/40 font-sans group-hover:text-white/60 transition-colors duration-700 leading-relaxed uppercase tracking-wider">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

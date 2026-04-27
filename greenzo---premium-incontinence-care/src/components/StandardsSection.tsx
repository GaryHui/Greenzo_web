import { useLanguageStore, translations } from '../translations';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Microscope } from 'lucide-react';

export default function StandardsSection() {
  const { language } = useLanguageStore();
  const t = (translations[language] as any).standards;

  if (!t) return null;

  const standards = [
    { icon: Award, label: t.iso, code: 'ISO 9001:2015' },
    { icon: ShieldCheck, label: t.medical, code: 'GB/T 28001' },
    { icon: Microscope, label: t.sgs, code: 'SGS REPORT PN230...' },
  ];

  return (
    <section className="py-32 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-10 md:px-16 text-center">
        <div className="text-[10px] uppercase tracking-[0.5em] text-brand-green font-bold mb-6">Certified Excellence</div>
        <h2 className="text-4xl font-serif text-brand-dark mb-10 leading-tight tracking-tighter max-w-2xl mx-auto">
          {t.title}
        </h2>
        <p className="text-sm text-black/50 font-sans leading-relaxed tracking-wide mb-24 max-w-xl mx-auto">
          {t.subtitle}
        </p>

        <div className="grid md:grid-cols-3 gap-16">
          {standards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-brand-muted border border-black/5 flex items-center justify-center mb-8 grayscale hover:grayscale-0 transition-all duration-700">
                <s.icon className="w-8 h-8 text-brand-green stroke-[1]" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-2">{s.label}</h4>
              <span className="text-[10px] font-sans text-black/30 tracking-widest">{s.code}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

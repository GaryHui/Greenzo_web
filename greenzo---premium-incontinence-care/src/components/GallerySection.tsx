import { useLanguageStore, translations } from '../translations';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { ASSET_CONFIG } from '../assets';

export default function GallerySection() {
  const { language } = useLanguageStore();
  const t = (translations[language] as any).gallery;
  const polaroidTilt = ['rotate-0'];

  if (!t) return null;

  return (
    <section id="gallery" className="py-20 md:py-32 bg-brand-cream border-t border-black/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="max-w-xl">
            <div className="text-[10px] uppercase tracking-[0.5em] text-brand-green font-bold mb-6">Gallery & Motion</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-dark mb-6 md:mb-8 leading-tight tracking-tighter">
              {t.title}
            </h2>
            <p className="text-sm text-black/50 font-sans leading-relaxed tracking-wide">
              {t.subtitle}
            </p>
          </div>
          <div className="h-px bg-black/10 flex-1 mx-12 hidden lg:block mb-4"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            {ASSET_CONFIG.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="min-h-[320px] sm:min-h-[360px] md:min-h-[420px] bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm group flex items-center justify-center p-4 sm:p-6 md:p-8"
              >
                <div className={`w-full max-w-[320px] sm:max-w-none sm:w-[88%] bg-white p-3 sm:p-4 pb-8 sm:pb-10 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] border border-black/8 transition-all duration-700 group-hover:-translate-y-1 ${polaroidTilt[i % polaroidTilt.length]}`}>
                  <div className="aspect-[3/4] bg-[#faf8f2] overflow-hidden flex items-center justify-center">
                    <img 
                      src={img} 
                      alt="Product Detail"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm group cursor-pointer min-h-[280px] sm:min-h-[360px] lg:min-h-0"
          >
            {/* Video Placeholder */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/40 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-700 backdrop-blur-sm">
                <Play className="text-white fill-white w-6 h-6 ml-1" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white shadow-xl">{t.videoLabel}</span>
            </div>
            <img 
              src={ASSET_CONFIG.videos.mainDemo.thumbnail} 
              alt="Video Thumbnail"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover grayscale-[0.6] blur-[2px] transition-all duration-1000 group-hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

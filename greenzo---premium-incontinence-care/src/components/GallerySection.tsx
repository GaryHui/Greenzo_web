import { useLanguageStore, translations } from '../translations';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { ASSET_CONFIG } from '../assets';

export default function GallerySection() {
  const { language } = useLanguageStore();
  const t = (translations[language] as any).gallery;

  if (!t) return null;

  return (
    <section id="gallery" className="py-32 bg-brand-cream border-t border-black/5">
      <div className="max-w-7xl mx-auto px-10 md:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <div className="text-[10px] uppercase tracking-[0.5em] text-brand-green font-bold mb-6">Gallery & Motion</div>
            <h2 className="text-5xl font-serif text-brand-dark mb-8 leading-tight tracking-tighter">
              {t.title}
            </h2>
            <p className="text-sm text-black/50 font-sans leading-relaxed tracking-wide">
              {t.subtitle}
            </p>
          </div>
          <div className="h-px bg-black/10 flex-1 mx-12 hidden lg:block mb-4"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            {ASSET_CONFIG.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="aspect-[4/3] bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm group"
              >
                <img 
                  src={img} 
                  alt="Product Detail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 aspect-[4/5] lg:aspect-auto bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm group cursor-pointer"
          >
            {/* Video Placeholder */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-700">
              <div className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 backdrop-blur-sm">
                <Play className="text-white fill-white w-6 h-6 ml-1" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white shadow-xl">{t.videoLabel}</span>
            </div>
            <img 
              src={ASSET_CONFIG.videos.mainDemo.thumbnail} 
              alt="Video Thumbnail"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale-[0.6] blur-[2px] transition-all duration-1000 group-hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

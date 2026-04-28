import { useLanguageStore, translations } from '../translations';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = translations[language].contact;
  const nav = translations[language].nav;

  return (
    <footer id="contact" className="bg-[#1A2616] text-white/90 pt-16 md:pt-24 pb-10 md:pb-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-14 md:mb-24">
          <div className="col-span-full lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <span className="text-xl sm:text-2xl font-bold tracking-tighter uppercase text-white">Greenzo</span>
              <span className="text-base sm:text-lg font-light opacity-60 ml-1">莞众</span>
            </div>
            <p className="text-white/40 font-sans text-xs uppercase tracking-widest leading-relaxed mb-8">
              Premium care since 2015.<br/>
              Purity • Dignity • Simplicity
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-white/10 hover:bg-white/5 rounded-full transition-colors"><Linkedin size={16} /></a>
              <a href="#" className="p-2 border border-white/10 hover:bg-white/5 rounded-full transition-colors"><Facebook size={16} /></a>
              <a href="#" className="p-2 border border-white/10 hover:bg-white/5 rounded-full transition-colors"><Instagram size={16} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-40">Navigation</h4>
            <ul className="space-y-4 text-white/60 text-xs uppercase tracking-widest font-bold">
              <li><a href="#home" className="hover:text-white transition-colors">{nav.home}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{nav.products}</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">{nav.story}</a></li>
            </ul>
          </div>

          <div className="col-span-full md:col-span-1 lg:col-span-2">
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-40">{t.title}</h4>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="text-xs font-light leading-relaxed tracking-wide text-white/70">{t.address}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block">{t.phone}</span>
                  <span className="text-sm font-bold tracking-tighter">0769-2226 3499</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block">{t.email}</span>
                  <span className="text-sm font-bold tracking-tighter">info@greenzo.com.cn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20 font-bold">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-px bg-white/5" />
            <span>&copy; 2026 GUANZHONG DAILY NECESSITIES CO., LTD.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

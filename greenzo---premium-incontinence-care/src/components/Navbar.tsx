import { useLanguageStore, translations } from '../translations';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language].nav;
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'zh', name: '简体' },
    { code: 'hk', name: '繁體' },
    { code: 'ja', name: '日本語' },
    { code: 'en', name: 'EN' },
  ] as const;

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-cream/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16 h-20 md:h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tighter uppercase text-brand-green">Greenzo</span>
            <span className="text-base sm:text-xl font-light opacity-60 ml-1 hidden sm:block">莞众</span>
          </div>
          <div className="h-px w-8 bg-black/10 hidden lg:block"></div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex gap-6 lg:gap-8 text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.25em] font-sans font-bold text-black/50">
            <li className="group">
              <a href="#home" className="text-brand-dark transition-colors">{t.home}</a>
            </li>
            <li className="group">
              <a href="#products" className="hover:text-brand-dark transition-colors">{t.products}</a>
            </li>
            <li className="group">
              <a href="#story" className="hover:text-brand-dark transition-colors">{t.story}</a>
            </li>
            <li className="group">
              <a href="#contact" className="hover:text-brand-dark transition-colors">{t.contact}</a>
            </li>
          </ul>
          
          <div className="flex gap-3 lg:gap-4 text-[10px] font-sans font-bold text-black/30 border-l border-black/10 pl-6 lg:pl-12 h-6 items-center">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`transition-all hover:text-brand-green ${
                  language === lang.code 
                  ? 'text-brand-green border-b border-brand-green' 
                  : ''
                }`}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden shrink-0 p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-zinc-100 px-5 py-6 sm:px-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#home" onClick={() => setIsOpen(false)} className="text-lg font-medium">{t.home}</a>
            <a href="#products" onClick={() => setIsOpen(false)} className="text-lg font-medium">{t.products}</a>
            <a href="#story" onClick={() => setIsOpen(false)} className="text-lg font-medium">{t.story}</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="text-lg font-medium">{t.contact}</a>
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-black/5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    language === lang.code 
                    ? 'bg-brand-green text-white border-brand-green' 
                    : 'text-slate-400 border-black/5'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

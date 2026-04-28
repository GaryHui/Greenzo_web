import { useLanguageStore, translations } from '../translations';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = translations[language].contact;
  const nav = translations[language].nav;
  const qrImages = useMemo(() => {
    const modules = import.meta.glob('../photo/QRcode/*.{png,jpg,jpeg,webp,avif}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>;

    const qrOrder = ['tmall', 'jd', 'pdd', 'douyin', 'redbook'];

    return Object.entries(modules)
      .sort(([pathA], [pathB]) =>
        pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' }),
      )
      .map(([path, src]) => {
        const filename = path.split('/').pop() ?? '';
        const label = filename.replace(/\.[^.]+$/, '');
        return { src, label };
      })
      .sort((a, b) => {
        const ai = qrOrder.indexOf(a.label.toLowerCase());
        const bi = qrOrder.indexOf(b.label.toLowerCase());
        const ap = ai === -1 ? 999 : ai;
        const bp = bi === -1 ? 999 : bi;
        if (ap !== bp) return ap - bp;
        return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' });
      });
  }, []);

  const [activeQrSrc, setActiveQrSrc] = useState<string | null>(null);

  const activeQr = qrImages.find((item) => item.src === activeQrSrc);

  const getDisplayLabel = (label: string) => {
    const normalized = label.toLowerCase();
    const labelMap = {
      zh: {
        tmall: '天猫',
        jd: '京东',
        pdd: '拼多多',
        douyin: '抖音',
        redbook: '小红书',
      },
      hk: {
        tmall: '天貓',
        jd: '京東',
        pdd: '拼多多',
        douyin: '抖音',
        redbook: '小紅書',
      },
      en: {
        tmall: 'Tmall',
        jd: 'JD',
        pdd: 'Pinduoduo',
        douyin: 'Douyin',
        redbook: 'Redbook',
      },
      ja: {
        tmall: '天猫',
        jd: '京東',
        pdd: '拼多多',
        douyin: '抖音',
        redbook: '小紅書',
      },
    } as const;

    return labelMap[language][normalized as keyof typeof labelMap.zh] ?? label;
  };

  const getQrHref = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized === 'jd') return 'https://mall.jd.com/index-11412427.html?from=pc&cid=0';
    if (normalized === 'redbook') return 'https://www.xiaohongshu.com/user/profile/6920137b0000000037029847?xhsshare=userQrCode&exSource=';
    return undefined;
  };

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
            {qrImages.length > 0 && (
              <div className="mt-10 relative" onMouseLeave={() => setActiveQrSrc(null)}>
                {activeQr && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 z-30 pointer-events-none">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-2xl border border-black/5">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-black/50 font-bold mb-2 text-center">
                        {getDisplayLabel(activeQr.label)}
                      </div>
                      <img
                        src={activeQr.src}
                        alt={`${getDisplayLabel(activeQr.label)} 原图`}
                        decoding="async"
                        className="w-[320px] h-[210px] sm:w-[360px] sm:h-[220px] object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {qrImages.map(({ src, label }) => {
                    const displayLabel = getDisplayLabel(label);
                    const isActive = src === activeQrSrc;
                    const href = getQrHref(label);

                    const content = (
                      <>
                        <div
                          className={`w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center transition-all ${
                            isActive ? 'ring-2 ring-brand-green ring-offset-2 ring-offset-[#1A2616]' : ''
                          }`}
                        >
                          <img
                            src={src}
                            alt={`${displayLabel} QR`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-bold text-center">
                          {displayLabel}
                        </span>
                      </>
                    );

                    if (href) {
                      return (
                        <a
                          key={src}
                          href={href}
                          target="_blank"
                          rel="noreferrer noopener"
                          onMouseEnter={() => setActiveQrSrc(src)}
                          onMouseLeave={() => setActiveQrSrc(null)}
                          className="flex flex-col items-center gap-2"
                          aria-label={`${displayLabel} 二维码（打开链接）`}
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={src}
                        type="button"
                        onMouseEnter={() => setActiveQrSrc(src)}
                        onMouseLeave={() => setActiveQrSrc(null)}
                        className="flex flex-col items-center gap-2"
                        aria-label={`${displayLabel} 二维码`}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-40">Navigation</h4>
            <ul className="space-y-4 text-white/60 text-xs uppercase tracking-widest font-bold">
              <li><a href="#home" className="hover:text-white transition-colors">{nav.home}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{nav.products}</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">{(nav as any).gallery}</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">{nav.story}</a></li>
            </ul>
          </div>

          <div className="col-span-full md:col-span-1 lg:col-span-2">
            <h4 className="text-white text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-40">{t.title}</h4>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex flex-col gap-6 h-full">
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
                  <span className="text-sm font-bold tracking-tighter">hujianhuan@163.com</span>
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

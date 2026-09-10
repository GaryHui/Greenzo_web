import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { heroMainImage, heroStillImage } from '../siteAssets';
import { scenePosters } from '../scenePosters';

const slides = [{ src: heroMainImage, still: heroStillImage, zh: '轻柔展开，贴身守护', en: 'Gentle care' },
  ...scenePosters.map(p => ({ ...p, still: p.src }))];

export default function HeroCarousel({ chinese }: { chinese: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const region = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const change = (direction: number) => setIndex(i => (i + direction + slides.length) % slides.length);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduced(media.matches);
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    if (region.current) observer.observe(region.current);
    return () => { media.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', onVisibility); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || !visible || !inView || reduced) return;
    const timer = window.setTimeout(() => change(1), 7000);
    return () => window.clearTimeout(timer);
  }, [index, paused, hovered, focused, visible, inView, reduced]);

  useEffect(() => {
    const next = new Image();
    next.src = slides[(index + 1) % slides.length].src;
  }, [index]);

  const slide = slides[index];
  const label = (zh: string, en: string) => chinese ? zh : en;
  const buttonClass = 'w-10 h-10 shrink-0 inline-flex items-center justify-center text-brand-dark hover:bg-brand-muted focus-visible:outline-2 focus-visible:outline-brand-green';
  return (
    <div ref={region} role="region" aria-roledescription="carousel" aria-label={label('护理场景轮播', 'Care scenes carousel')}
      className="w-full max-w-[440px] md:max-w-[min(440px,calc((100svh-11rem)*3/4))]"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
      onKeyDown={e => { if (e.key === 'ArrowLeft') { e.preventDefault(); change(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); change(1); } }}>
      <div className="aspect-[3/4] overflow-hidden bg-white touch-pan-y"
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { if (startX.current !== null) { const delta = e.changedTouches[0].clientX - startX.current; if (Math.abs(delta) > 50) change(delta < 0 ? 1 : -1); } startX.current = null; }}>
        <img src={reduced ? slide.still : slide.src} alt={chinese ? slide.zh : slide.en}
          width={1080} height={1440} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'}
          className="w-full h-full object-contain" />
      </div>
      <div className="flex items-center justify-between gap-1 py-1 border-b border-brand-line">
        <button type="button" className={buttonClass} title={label('上一张', 'Previous')} aria-label={label('上一张', 'Previous')} onClick={() => change(-1)}><ChevronLeft size={18} /></button>
        <span className="text-xs tabular-nums text-brand-dark/60">{index + 1} / {slides.length}</span>
        <div className="flex">
          {!reduced && <button type="button" className={buttonClass} title={label(paused ? '继续轮播' : '暂停轮播', paused ? 'Play' : 'Pause')} aria-label={label(paused ? '继续轮播' : '暂停轮播', paused ? 'Play' : 'Pause')} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
          <button type="button" className={buttonClass} title={label('下一张', 'Next')} aria-label={label('下一张', 'Next')} onClick={() => change(1)}><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

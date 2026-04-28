import { useLanguageStore, translations } from '../translations';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX, X } from 'lucide-react';
import { ASSET_CONFIG } from '../assets';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function GallerySection() {
  const { language } = useLanguageStore();
  const t = (translations[language] as any).gallery;
  const polaroidTilt = ['rotate-0'];
  const images = useMemo(() => ASSET_CONFIG.gallery ?? [], []);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videos = useMemo(() => {
    const list = (ASSET_CONFIG as any)?.videos?.playlist ?? [];
    if (Array.isArray(list) && list.length > 0) return list.filter((v) => v?.src);
    const fallbackSrc = (ASSET_CONFIG as any)?.videos?.mainDemo?.url;
    return typeof fallbackSrc === 'string' && fallbackSrc !== '#' ? [{ src: fallbackSrc }] : [];
  }, []);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);

  if (!t) return null;

  const currentIndex = viewerIndex ?? 0;
  const currentPreviewIndex = Math.min(Math.max(activeImageIndex, 0), Math.max(0, images.length - 1));

  const closeViewer = () => setViewerIndex(null);

  const closeVideo = () => {
    setIsVideoOpen(false);
    setActiveVideoIndex(videoIndex);
  };

  const goPrev = () => {
    setViewerIndex((idx) => {
      if (idx === null) return 0;
      if (images.length <= 0) return 0;
      return (idx - 1 + images.length) % images.length;
    });
  };

  const goNext = () => {
    setViewerIndex((idx) => {
      if (idx === null) return 0;
      if (images.length <= 0) return 0;
      return (idx + 1) % images.length;
    });
  };

  useEffect(() => {
    if (viewerIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewerIndex, images.length]);

  useEffect(() => {
    if (!isVideoOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideo();
      if (e.key === 'ArrowLeft' && videos.length > 1) {
        setVideoIndex((idx) => (idx - 1 + videos.length) % videos.length);
      }
      if (e.key === 'ArrowRight' && videos.length > 1) {
        setVideoIndex((idx) => (idx + 1) % videos.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVideoOpen, videos.length]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [viewerIndex]);

  useEffect(() => {
    if (!isVideoOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isVideoOpen]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = Math.min(1, Math.max(0, volume));
  }, [volume]);

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
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              onClick={() => {
                if (images.length <= 0) return;
                setViewerIndex(currentPreviewIndex);
              }}
              className="min-h-[320px] sm:min-h-[360px] md:min-h-[420px] bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm group flex items-center justify-center p-4 sm:p-6 md:p-8 cursor-zoom-in"
            >
              {images.length > 0 && (
                <div className={`w-full max-w-[420px] sm:max-w-none sm:w-[70%] bg-white p-3 sm:p-4 pb-8 sm:pb-10 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] border border-black/8 transition-all duration-700 group-hover:-translate-y-1 ${polaroidTilt[0]}`}>
                  <div className="aspect-[3/4] bg-[#faf8f2] overflow-hidden flex items-center justify-center">
                    <img 
                      src={images[currentPreviewIndex]} 
                      alt={`Gallery ${currentPreviewIndex + 1}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="mt-6 md:mt-8">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((src, i) => {
                    const isActive = i === currentPreviewIndex;
                    return (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        onClick={() => setActiveImageIndex(i)}
                        className={`shrink-0 w-20 h-16 rounded-md overflow-hidden border transition-colors bg-white ${
                          isActive ? 'border-brand-green' : 'border-black/10 hover:border-black/30'
                        }`}
                      >
                        <div className="w-full h-full bg-[#faf8f2] flex items-center justify-center p-1">
                          <img
                            src={src}
                            alt={`Gallery thumb ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm group cursor-pointer min-h-[280px] sm:min-h-[360px] lg:min-h-0"
            onClick={() => {
              if (videos.length <= 0) return;
              setVideoIndex(activeVideoIndex);
              setIsMuted(true);
              setVolume(0.6);
              setIsVideoOpen(true);
            }}
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

        {videos.length > 1 && (
          <div className="mt-6 md:mt-8 flex justify-end">
            <div className="flex gap-2 flex-wrap justify-end">
              {videos.map((v, i) => {
                const isActive = i === activeVideoIndex;
                return (
                  <button
                    key={`${v?.src}-${i}`}
                    type="button"
                    onClick={() => setActiveVideoIndex(i)}
                    className={`px-3 py-2 border text-[10px] uppercase tracking-[0.25em] font-bold transition-all ${
                      isActive
                        ? 'bg-brand-green text-white border-brand-green'
                        : 'bg-white text-brand-dark border-black/10 hover:border-brand-green'
                    }`}
                  >
                    {i < 9 ? `0${i + 1}` : `${i + 1}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewerIndex !== null && images.length > 0 && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeViewer}
              className="absolute inset-0 bg-brand-dark/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl bg-brand-cream shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-black/10">
                <div className="text-[10px] uppercase tracking-[0.4em] text-brand-green font-bold">
                  {currentIndex + 1}/{images.length}
                </div>
                <button
                  type="button"
                  onClick={closeViewer}
                  className="p-2 rounded-full bg-white/80 hover:bg-white border border-black/10"
                >
                  <X className="w-5 h-5 text-brand-dark" />
                </button>
              </div>

              <div className="relative flex-1 bg-brand-muted overflow-hidden flex items-center justify-center">
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/85 hover:bg-white border border-black/10 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-brand-dark" />
                  </button>
                )}

                <img
                  src={images[currentIndex]}
                  alt={`Gallery ${currentIndex + 1}`}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  className="w-full h-full object-contain p-4 sm:p-8"
                />

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/85 hover:bg-white border border-black/10 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-brand-dark" />
                  </button>
                )}
              </div>

              {images.length > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-black/10">
                  <div className="flex gap-3 overflow-x-auto">
                    {images.map((src, i) => {
                      const isActive = i === currentIndex;
                      return (
                        <button
                          key={`${src}-${i}`}
                          type="button"
                          onClick={() => setViewerIndex(i)}
                          className={`shrink-0 w-20 h-16 rounded-md overflow-hidden border transition-colors bg-white ${
                            isActive ? 'border-brand-green' : 'border-black/10 hover:border-black/30'
                          }`}
                        >
                          <div className="w-full h-full bg-[#faf8f2] flex items-center justify-center p-1">
                            <img
                              src={src}
                              alt={`Gallery thumb ${i + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVideoOpen && videos.length > 0 && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVideo}
              className="absolute inset-0 bg-brand-dark/30 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl bg-brand-cream shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-black/10">
                <div className="text-[10px] uppercase tracking-[0.4em] text-brand-green font-bold">
                  {videoIndex + 1}/{videos.length}
                </div>
                <button
                  type="button"
                  onClick={closeVideo}
                  className="p-2 rounded-full bg-white/80 hover:bg-white border border-black/10"
                >
                  <X className="w-5 h-5 text-brand-dark" />
                </button>
              </div>

              <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                {videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVideoIndex((idx) => (idx - 1 + videos.length) % videos.length)}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/85 hover:bg-white border border-black/10 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-brand-dark" />
                  </button>
                )}

                <video
                  ref={videoRef}
                  key={videos[videoIndex]?.src}
                  src={videos[videoIndex]?.src}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  loop={videos.length === 1}
                  onEnded={() => {
                    if (videos.length <= 1) return;
                    setVideoIndex((idx) => (idx + 1) % videos.length);
                  }}
                  onCanPlay={() => {
                    const el = videoRef.current;
                    if (!el) return;
                    el.volume = Math.min(1, Math.max(0, volume));
                  }}
                  className="w-full h-full object-contain"
                  controls
                  controlsList="nodownload noplaybackrate"
                />

                {videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVideoIndex((idx) => (idx + 1) % videos.length)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/85 hover:bg-white border border-black/10 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-brand-dark" />
                  </button>
                )}
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-black/10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  className="p-2 rounded-full bg-white/80 hover:bg-white border border-black/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-brand-dark" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-brand-dark" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-brand-green"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

import { useLanguageStore, translations } from '../translations';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';
import { ASSET_CONFIG } from '../assets';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function GallerySection() {
  const { language } = useLanguageStore();
  const t = (translations[language] as any).gallery;
  const polaroidTilt = ['rotate-0'];
  const images = useMemo(() => ASSET_CONFIG.gallery ?? [], []);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
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
  const gridImages = Array.from({ length: 4 }, (_, i) => images[i] ?? null);

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

  useEffect(() => {
    const el = previewVideoRef.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [activeVideoIndex, videos.length]);

  useEffect(() => {
    const retryPlay = () => {
      const el = previewVideoRef.current;
      if (!el) return;
      el.muted = true;
      el.defaultMuted = true;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden) retryPlay();
    };

    window.addEventListener('touchstart', retryPlay, { once: true, passive: true });
    window.addEventListener('click', retryPlay, { once: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [activeVideoIndex, videos.length]);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-brand-cream border-t border-black/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="max-w-lg">
            <div className="text-[10px] uppercase tracking-[0.45em] text-brand-green font-bold mb-4">Gallery & Motion</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-dark mb-4 md:mb-5 leading-tight tracking-tighter">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-black/50 font-sans leading-relaxed tracking-wide">
              {t.subtitle}
            </p>
          </div>
          <div className="h-px bg-black/10 flex-1 mx-10 hidden lg:block mb-3"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-6 h-full">
            {gridImages.map((img, i) => (
              <motion.div
                key={`${img ?? 'empty'}-${i}`}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.06 }}
                onClick={() => {
                  if (!img) return;
                  setViewerIndex(i);
                }}
                className={`bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm flex items-center justify-center p-3 sm:p-4 md:p-5 h-full ${
                  img ? 'group cursor-zoom-in' : ''
                }`}
              >
                {img && (
                  <div className={`w-full h-full bg-white p-2 sm:p-3 pb-6 sm:pb-7 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] border border-black/8 transition-all duration-700 group-hover:-translate-y-1 ${polaroidTilt[i % polaroidTilt.length]}`}>
                    <div className="w-full h-full bg-[#faf8f2] overflow-hidden flex items-center justify-center">
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-muted relative overflow-hidden border border-black/5 shadow-sm min-h-[260px] sm:min-h-[300px] md:min-h-[340px] flex flex-col group cursor-pointer"
            onClick={() => {
              if (videos.length <= 0) return;
              setVideoIndex(activeVideoIndex);
              setIsMuted(true);
              setVolume(0.6);
              setIsVideoOpen(true);
            }}
          >
            <div className="flex-1 relative">
              {videos.length > 0 ? (
                <video
                  ref={previewVideoRef}
                  key={videos[activeVideoIndex]?.src}
                  src={videos[activeVideoIndex]?.src}
                  autoPlay
                  muted
                  defaultMuted
                  playsInline
                  preload="auto"
                  loop={videos.length === 1}
                  onCanPlay={(e) => {
                    e.currentTarget.muted = true;
                    const playPromise = e.currentTarget.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }}
                  onEnded={() => {
                    if (videos.length <= 1) return;
                    setActiveVideoIndex((idx) => (idx + 1) % videos.length);
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40">{t.videoLabel}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/45 to-transparent">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/90">{t.videoLabel}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {videos.length > 1 && (
          <div className="mt-4 md:mt-5 flex items-center justify-center gap-3">
            <span className="text-[10px] font-bold tracking-[0.25em] text-black/45">
              {activeVideoIndex + 1}/{videos.length}
            </span>
            <div className="flex items-center gap-2">
              {videos.map((v, i) => {
                const isActive = i === activeVideoIndex;
                return (
                  <button
                    key={`${v?.src}-${i}`}
                    type="button"
                    onClick={() => setActiveVideoIndex(i)}
                    aria-label={`切换视频 ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      isActive
                        ? 'bg-brand-green border-brand-green scale-110'
                        : 'bg-white border-black/20 hover:border-brand-green'
                    }`}
                  />
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

                <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 py-6 sm:py-10">
                  <div className="w-full max-w-[560px] sm:max-w-[720px] bg-white p-3 sm:p-4 pb-10 sm:pb-12 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.6)] border border-black/10">
                    <div className="w-full bg-[#faf8f2] overflow-hidden flex items-center justify-center h-[52vh] sm:h-[56vh] max-h-[720px]">
                      <img
                        src={images[currentIndex]}
                        alt={`Gallery ${currentIndex + 1}`}
                        referrerPolicy="no-referrer"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

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

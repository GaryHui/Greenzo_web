import { useLanguageStore, translations } from '../translations';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, ShoppingBag, Wind } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ASSET_CONFIG, type ProductCatalogItem } from '../assets';

type DisplayProductImage = {
  src: string;
  caption?: string;
};

type DisplayProduct = {
  id: string;
  name: string;
  desc?: string;
  features?: string;
  specs: string[];
  images: DisplayProductImage[];
  coverImage: string;
  mainCategory: string;
  subCategory: string;
};

const MAIN_CATEGORY_ORDER = ['Adult', 'Dairy', 'Personal'] as const;
const ADULT_SUBCATEGORY_ORDER = ['diaper', 'pad', 'urinal'] as const;

function pickLocalizedText(
  value: unknown,
  language: string,
  fallbackLanguage = 'zh',
): string | undefined {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const preferred = record[language];
  if (typeof preferred === 'string') return preferred;
  const fallback = record[fallbackLanguage];
  if (typeof fallback === 'string') return fallback;
  const first = Object.values(record).find((v) => typeof v === 'string');
  return typeof first === 'string' ? first : undefined;
}

function pickLocalizedTextArray(
  value: unknown,
  language: string,
  fallbackLanguage = 'zh',
): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string') as string[];
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  const preferred = record[language];
  if (Array.isArray(preferred)) {
    return preferred.filter((v) => typeof v === 'string') as string[];
  }
  const fallback = record[fallbackLanguage];
  if (Array.isArray(fallback)) {
    return fallback.filter((v) => typeof v === 'string') as string[];
  }
  const first = Object.values(record).find((v) => Array.isArray(v));
  return Array.isArray(first)
    ? (first.filter((v) => typeof v === 'string') as string[])
    : [];
}

export default function ProductSection() {
  const { language } = useLanguageStore();
  const t = translations[language].products;
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null);
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState(0);
  const [activeMainCategory, setActiveMainCategory] = useState<string>('Adult');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('diaper');
  const [lastUserScrollAt, setLastUserScrollAt] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselScrollRafRef = useRef<number | null>(null);
  const polaroidTilt = ['rotate-0'];

  const getProductImage = () => ASSET_CONFIG.hero.mainImage;

  const products: DisplayProduct[] = useMemo(() => {
    const catalog = (ASSET_CONFIG.productCatalog ?? []) as ProductCatalogItem[];
    if (Array.isArray(catalog) && catalog.length > 0) {
      return catalog.map((item) => {
        const name =
          pickLocalizedText(item.name, language) ||
          item.id ||
          item.productKey ||
          'Product';
        const desc = pickLocalizedText(item.desc, language);
        const features = pickLocalizedText(item.features, language);
        const specs = pickLocalizedTextArray(item.specs, language);
        const images: DisplayProductImage[] = (item.images ?? []).map((img) => ({
          src: img.src,
          caption: pickLocalizedText(img.caption, language),
        }));

        const coverImage = images[0]?.src || getProductImage();
        const ensuredImages = images.length > 0 ? images : [{ src: coverImage }];
        return {
          id: item.id,
          name,
          desc,
          features,
          specs,
          images: ensuredImages,
          coverImage,
          mainCategory: item.mainCategory,
          subCategory: item.subCategory,
        };
      });
    }

    const mapped: DisplayProduct[] = [];
    const incontinenceItems = t.categories.incontinence?.items ?? [];
    const householdItems = t.categories.household?.items ?? [];
    const personalItems = t.categories.personal?.items ?? [];

    for (const product of incontinenceItems) {
      const coverImage = getProductImage();
      mapped.push({
        id: product.id,
        name: product.name,
        desc: product.desc,
        features: product.features,
        specs: product.specs ?? [],
        images: [{ src: coverImage }],
        coverImage,
        mainCategory: 'Adult',
        subCategory: product.id,
      });
    }

    for (const product of householdItems) {
      const coverImage = getProductImage();
      mapped.push({
        id: product.id,
        name: product.name,
        desc: product.desc,
        features: product.features,
        specs: product.specs ?? [],
        images: [{ src: coverImage }],
        coverImage,
        mainCategory: 'Dairy',
        subCategory: product.id,
      });
    }

    for (const product of personalItems) {
      const coverImage = getProductImage();
      mapped.push({
        id: product.id,
        name: product.name,
        desc: product.desc,
        features: product.features,
        specs: product.specs ?? [],
        images: [{ src: coverImage }],
        coverImage,
        mainCategory: 'Personal',
        subCategory: product.id,
      });
    }

    return mapped;
  }, [language, t]);

  const mainCategoryIcons: Record<string, any> = {
    Adult: Shield,
    Dairy: Wind,
    Personal: ShoppingBag,
  };

  const mainCategories = useMemo(() => {
    const inData = Array.from(new Set(products.map((p) => p.mainCategory))).filter(Boolean);
    const ordered = [
      ...MAIN_CATEGORY_ORDER.filter((c) => inData.includes(c)),
      ...inData.filter((c) => !MAIN_CATEGORY_ORDER.includes(c as any)),
    ];
    return ordered.length > 0 ? ordered : [...MAIN_CATEGORY_ORDER];
  }, [products]);

  const subCategories = useMemo(() => {
    const inMain = products
      .filter((p) => p.mainCategory === activeMainCategory)
      .map((p) => p.subCategory)
      .filter(Boolean);

    const unique = Array.from(new Set(inMain));
    if (unique.length === 0) {
      return activeMainCategory === 'Adult' ? [...ADULT_SUBCATEGORY_ORDER] : ['all'];
    }

    if (activeMainCategory === 'Adult') {
      return [
        ...ADULT_SUBCATEGORY_ORDER,
        ...unique.filter((c) => !ADULT_SUBCATEGORY_ORDER.includes(c as any)),
      ];
    }

    unique.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
    );
    return unique;
  }, [products, activeMainCategory]);

  const visibleProducts = useMemo(() => {
    const inMain = products.filter((p) => p.mainCategory === activeMainCategory);
    if (activeSubCategory === 'all') return inMain;
    return inMain.filter((p) => p.subCategory === activeSubCategory);
  }, [products, activeMainCategory, activeSubCategory]);

  useEffect(() => {
    setSelectedProductImageIndex(0);
  }, [selectedProduct?.id]);

  useEffect(() => {
    const nextSub = subCategories[0] ?? 'all';
    setActiveSubCategory(nextSub);
  }, [activeMainCategory, subCategories]);

  useEffect(() => {
    if (!selectedProduct) return;
    setLastUserScrollAt(0);
  }, [selectedProduct?.id]);

  useEffect(() => {
    if (!selectedProduct) return;
    if (selectedProduct.images.length <= 1) return;

    const id = window.setInterval(() => {
      const now = Date.now();
      if (now - lastUserScrollAt < 2500) return;
      setSelectedProductImageIndex((current) => {
        const next = (current + 1) % selectedProduct.images.length;
        return next;
      });
    }, 2000);

    return () => window.clearInterval(id);
  }, [selectedProduct?.id, selectedProduct?.images.length, lastUserScrollAt]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * selectedProductImageIndex, behavior: 'smooth' });
  }, [selectedProductImageIndex]);

  useEffect(() => {
    return () => {
      if (carouselScrollRafRef.current) {
        window.cancelAnimationFrame(carouselScrollRafRef.current);
        carouselScrollRafRef.current = null;
      }
    };
  }, []);

  return (
    <section id="products" className="py-20 md:py-32 bg-brand-cream border-t border-black/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-brand-green font-bold mb-4">The Collection</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-dark leading-tight">{t.title}</h2>
          </div>
          <div className="h-px flex-1 bg-black/10 mx-12 hidden lg:block mb-4"></div>
          <p className="text-xs uppercase tracking-widest text-black/40 font-sans max-w-[200px] mb-2">
            Engineered for comfort. Designed for dignity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-10">
          {mainCategories.map((categoryId) => {
            const Icon = mainCategoryIcons[categoryId] || Shield;
            const isActive = activeMainCategory === categoryId;
            return (
              <button
                key={categoryId}
                onClick={() => setActiveMainCategory(categoryId)}
                className={`w-full sm:w-auto justify-center sm:justify-start flex items-center gap-3 px-5 sm:px-6 md:px-8 py-4 md:py-5 border transition-all duration-500 relative overflow-hidden group ${
                  isActive
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-brand-dark border-black/5 hover:border-brand-green'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-brand-green' : 'text-black/20'}`}
                />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-center sm:text-left">
                  {categoryId}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green"
                  />
                )}
              </button>
            );
          })}
        </div>

        {subCategories.length > 1 && (
          <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-16">
            {subCategories.map((subId) => {
              const isActive = activeSubCategory === subId;
              return (
                <button
                  key={subId}
                  onClick={() => setActiveSubCategory(subId)}
                  className={`px-4 sm:px-5 py-2.5 border text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold transition-all ${
                    isActive
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white text-brand-dark border-black/5 hover:border-brand-green'
                  }`}
                >
                  {subId}
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeMainCategory}-${activeSubCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8 md:gap-12"
          >
            {visibleProducts.map((product: DisplayProduct, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="bg-white flex flex-col p-5 sm:p-6 md:p-8 transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative border border-black/5">
                  <div className="absolute inset-0 bg-brand-muted opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className={`w-full h-full relative p-1 sm:p-2 md:p-4 transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-[1.03] flex items-center justify-center ${polaroidTilt[index % polaroidTilt.length]}`}>
                      <div className="w-full max-w-[250px] bg-white p-3 sm:p-4 pb-7 sm:pb-8 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.35)] border border-black/8">
                        <div className="aspect-[3/4] bg-[#faf8f2] overflow-hidden flex items-center justify-center">
                          <img 
                            src={product.coverImage} 
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 relative z-10">
                    <div className="text-[9px] uppercase font-bold text-brand-green tracking-[0.3em] mb-2 opacity-60">
                      {index < 9 ? `Series 0${index + 1}` : `Series ${index + 1}`}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-light text-brand-dark transition-colors duration-500">{product.name}</h3>
                  </div>
                </div>
                <p className="mt-4 md:mt-6 text-[11px] text-black/40 uppercase tracking-[0.2em] sm:tracking-widest font-bold group-hover:text-brand-green transition-colors">
                  View Details & Specs —
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-brand-dark/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-brand-cream shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Product Image in Modal */}
              <div className="md:w-1/2 bg-brand-muted relative overflow-hidden flex flex-col">
                <div className="flex-1 flex flex-col">
                  <div
                    ref={carouselRef}
                    onPointerDown={() => setLastUserScrollAt(Date.now())}
                    onWheel={() => setLastUserScrollAt(Date.now())}
                    onTouchStart={() => setLastUserScrollAt(Date.now())}
                    onScroll={() => {
                      const el = carouselRef.current;
                      if (!el) return;
                      if (carouselScrollRafRef.current) {
                        window.cancelAnimationFrame(carouselScrollRafRef.current);
                      }
                      carouselScrollRafRef.current = window.requestAnimationFrame(() => {
                        const width = el.clientWidth || 1;
                        const nextIndex = Math.round(el.scrollLeft / width);
                        if (Number.isFinite(nextIndex)) {
                          setSelectedProductImageIndex((current) =>
                            current === nextIndex ? current : nextIndex,
                          );
                        }
                      });
                    }}
                    className="flex-1 overflow-x-auto flex snap-x snap-mandatory"
                  >
                    {selectedProduct.images.map((img, i) => (
                      <div
                        key={`${img.src}-${i}`}
                        className="w-full shrink-0 snap-center flex items-center justify-center p-6 sm:p-8"
                      >
                        <img
                          src={img.src}
                          alt={`${selectedProduct.name} ${i + 1}`}
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>

                  {selectedProduct.images[selectedProductImageIndex]?.caption && (
                    <div className="px-6 pb-3 sm:px-8 text-[11px] text-black/55 tracking-wide">
                      {selectedProduct.images[selectedProductImageIndex]?.caption}
                    </div>
                  )}

                  {selectedProduct.images.length > 1 && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      <div className="flex gap-3 overflow-x-auto">
                        {selectedProduct.images.map((img, i) => {
                          const isActive = i === selectedProductImageIndex;
                          return (
                            <button
                              key={`${img.src}-${i}`}
                              type="button"
                              onClick={() => {
                                setLastUserScrollAt(Date.now());
                                setSelectedProductImageIndex(i);
                              }}
                              className={`shrink-0 w-20 h-16 rounded-md overflow-hidden border transition-colors ${
                                isActive
                                  ? 'border-brand-green'
                                  : 'border-black/10 hover:border-black/30'
                              }`}
                            >
                              <img
                                src={img.src}
                                alt={`${selectedProduct.name} ${i + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 left-6 md:hidden p-2 bg-white rounded-full shadow-lg"
                >
                  <X className="w-5 h-5 text-brand-dark" />
                </button>
              </div>

              {/* Product Info in Modal */}
              <div className="md:w-1/2 p-6 sm:p-8 md:p-16 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.4em] text-brand-green font-bold mb-4">Product Detail</div>
                    <h3 className="text-3xl sm:text-4xl font-serif text-brand-dark leading-tight">
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="hidden md:block p-2 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-brand-dark" />
                  </button>
                </div>

                <p className="text-sm text-black/60 font-sans leading-relaxed mb-10">
                  {selectedProduct.features || selectedProduct.desc}
                </p>

                <div className="space-y-4 mb-12">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/30 mb-6">Specifications</div>
                  {selectedProduct.specs.map((spec: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-black/5">
                      <div className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-sm shadow-brand-green/30" />
                      <span className="text-xs font-bold tracking-wide uppercase text-brand-dark/80">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-4 bg-brand-green text-white text-[10px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-brand-dark transition-all duration-500"
                  >
                    {t.details.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

import { useLanguageStore, translations } from '../translations';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Shield, Heart, X, ShoppingBag, Wind } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { ASSET_CONFIG } from '../assets';

export default function ProductSection() {
  const { language } = useLanguageStore();
  const t = translations[language].products;
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedProductImageIndex, setSelectedProductImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('incontinence');
  const polaroidTilt = ['-rotate-2', 'rotate-2', '-rotate-1'];

  // Map category IDs to icons
  const categoryIcons:Record<string, any> = {
    incontinence: Shield,
    household: Wind,
    personal: ShoppingBag,
  };

  const categories = useMemo(() => {
    return Object.entries(t.categories).map(([id, category]: [string, any]) => ({
      id,
      ...category,
      icon: categoryIcons[id] || Heart,
    }));
  }, [t, language]);

  const activeCategoryData = categories.find(c => c.id === activeCategory);

  const getProductImage = (productId: string) => {
    // Fallback logic for images
    const configImages: Record<string, string> = {
      diaper: ASSET_CONFIG.products.diaper,
      pad: ASSET_CONFIG.products.pad,
      wipe: ASSET_CONFIG.products.wipe,
      'soft-tissue': ASSET_CONFIG.products.softTissue,
    };
    return configImages[productId] || ASSET_CONFIG.products.softTissue;
  };

  const getProductDetailImages = (productId: string) => {
    const detailImages = ASSET_CONFIG.productDetails[productId];
    if (Array.isArray(detailImages) && detailImages.length > 0) return detailImages;
    return [getProductImage(productId)];
  };

  useEffect(() => {
    setSelectedProductImageIndex(0);
  }, [selectedProduct?.id]);

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

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-12 md:mb-20">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full sm:w-auto justify-center sm:justify-start flex items-center gap-3 px-5 sm:px-6 md:px-8 py-4 md:py-5 border transition-all duration-500 relative overflow-hidden group ${
                  isActive 
                    ? 'bg-brand-dark text-white border-brand-dark' 
                    : 'bg-white text-brand-dark border-black/5 hover:border-brand-green'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-brand-green' : 'text-black/20'}`} />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-center sm:text-left">{category.name}</span>
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

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8 md:gap-12"
          >
            {activeCategoryData?.items.map((product: any, index: number) => (
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
                            src={getProductImage(product.id)} 
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
                {(() => {
                  const images = getProductDetailImages(selectedProduct.id);
                  const activeImage = images[selectedProductImageIndex] ?? images[0];
                  return (
                    <>
                      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
                        <img 
                          src={activeImage} 
                          alt={selectedProduct.name}
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {images.length > 1 && (
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                          <div className="flex gap-3 overflow-x-auto">
                            {images.map((src, i) => {
                              const isActive = i === selectedProductImageIndex;
                              return (
                                <button
                                  key={`${src}-${i}`}
                                  type="button"
                                  onClick={() => setSelectedProductImageIndex(i)}
                                  className={`shrink-0 w-20 h-16 rounded-md overflow-hidden border transition-colors ${
                                    isActive ? 'border-brand-green' : 'border-black/10 hover:border-black/30'
                                  }`}
                                >
                                  <img
                                    src={src}
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
                    </>
                  );
                })()}
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
                  {selectedProduct.features}
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

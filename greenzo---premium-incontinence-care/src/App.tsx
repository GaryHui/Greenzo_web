import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandStory from './components/BrandStory';
import QualitySection from './components/QualitySection';
import Footer from './components/Footer';
import { hasStoredLanguagePreference, useLanguageStore, type Language } from './translations';

const GallerySection = lazy(() => import('./components/GallerySection'));
const ProductSection = lazy(() => import('./components/ProductSection'));
const StandardsSection = lazy(() => import('./components/StandardsSection'));

function SectionFallback() {
  return <div className="py-12 md:py-16" aria-hidden="true" />;
}

export default function App() {
  const setDetectedLanguage = useLanguageStore((state) => state.setDetectedLanguage);

  useEffect(() => {
    if (hasStoredLanguagePreference()) return;

    let isActive = true;

    fetch('/api/locale')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Locale request failed: ${response.status}`);
        }

        return response.json() as Promise<{ language: Language | null }>;
      })
      .then((data) => {
        if (isActive && data.language) {
          setDetectedLanguage(data.language);
        }
      })
      .catch(() => {
        // Keep the browser-locale fallback when geo headers are unavailable.
      });

    return () => {
      isActive = false;
    };
  }, [setDetectedLanguage]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main>
        <Hero />
        <QualitySection />
        <Suspense fallback={<SectionFallback />}>
          <GallerySection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProductSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <StandardsSection />
        </Suspense>
        <BrandStory />
      </main>
      <Footer />
    </div>
  );
}

import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import BrandStory from './components/BrandStory';
import QualitySection from './components/QualitySection';
import GallerySection from './components/GallerySection';
import StandardsSection from './components/StandardsSection';
import Footer from './components/Footer';
import { hasStoredLanguagePreference, useLanguageStore, type Language } from './translations';

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
        <GallerySection />
        <ProductSection />
        <StandardsSection />
        <BrandStory />
      </main>
      <Footer />
    </div>
  );
}

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
const KnowledgeSection = lazy(() => import('./components/KnowledgeSection'));
const ArticlePage = lazy(() => import('./components/ArticlePage'));
const ArticlesHomePage = lazy(() => import('./components/ArticlesHomePage'));

function SectionFallback() {
  return <div className="py-12 md:py-16" aria-hidden="true" />;
}

function resolveArticleRoute(pathname: string): { type: 'home' | 'detail'; slug?: string } | null {
  if (pathname === '/articles' || pathname === '/articles/') {
    return { type: 'home' };
  }
  const match = pathname.match(/^\/articles\/([^/]+)\/?$/);
  if (match?.[1]) {
    return { type: 'detail', slug: match[1] };
  }
  return null;
}

export default function App() {
  const setDetectedLanguage = useLanguageStore((state) => state.setDetectedLanguage);
  const articleRoute = resolveArticleRoute(window.location.pathname);

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

  if (articleRoute?.type === 'home') {
    return (
      <Suspense fallback={<SectionFallback />}>
        <ArticlesHomePage />
      </Suspense>
    );
  }

  if (articleRoute?.type === 'detail' && articleRoute.slug) {
    return (
      <Suspense fallback={<SectionFallback />}>
        <ArticlePage slug={articleRoute.slug} />
      </Suspense>
    );
  }

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
        <Suspense fallback={<SectionFallback />}>
          <KnowledgeSection />
        </Suspense>
        <BrandStory />
      </main>
      <Footer />
    </div>
  );
}

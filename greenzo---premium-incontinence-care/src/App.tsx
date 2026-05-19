import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { hasStoredLanguagePreference, useLanguageStore, type Language } from './translations';

const QualitySection = lazy(() => import('./components/QualitySection'));
const GallerySection = lazy(() => import('./components/GallerySection'));
const ProductSection = lazy(() => import('./components/ProductSection'));
const StandardsSection = lazy(() => import('./components/StandardsSection'));
const KnowledgeSection = lazy(() => import('./components/KnowledgeSection'));
const BrandStory = lazy(() => import('./components/BrandStory'));
const ArticlePage = lazy(() => import('./components/ArticlePage'));
const ArticlesHomePage = lazy(() => import('./components/ArticlesHomePage'));

function SectionFallback() {
  return <div className="py-12 md:py-16" aria-hidden="true" />;
}

function ViewportSection({
  anchorId,
  children,
  minHeight = 'min-h-[420px]',
}: {
  anchorId?: string;
  children: ReactNode;
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const node = ref.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: '700px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div
      ref={ref}
      id={shouldRender ? undefined : anchorId}
      className={shouldRender ? undefined : minHeight}
      aria-busy={!shouldRender}
    >
      {shouldRender ? <Suspense fallback={<SectionFallback />}>{children}</Suspense> : null}
    </div>
  );
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
    if (articleRoute) return;

    const preloadArticleRoutes = () => {
      void import('./components/ArticlesHomePage');
      void import('./components/ArticlePage');
    };

    const requestIdle = window.requestIdleCallback;
    const cancelIdle = window.cancelIdleCallback;
    if (typeof requestIdle === 'function' && typeof cancelIdle === 'function') {
      const idleId = requestIdle(preloadArticleRoutes, { timeout: 2500 });
      return () => cancelIdle(idleId);
    }

    const timeoutId = window.setTimeout(preloadArticleRoutes, 1800);
    return () => window.clearTimeout(timeoutId);
  }, [articleRoute]);

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
        <ViewportSection minHeight="min-h-[520px]">
          <QualitySection />
        </ViewportSection>
        <ViewportSection anchorId="gallery" minHeight="min-h-[620px]">
          <GallerySection />
        </ViewportSection>
        <ViewportSection anchorId="products" minHeight="min-h-[760px]">
          <ProductSection />
        </ViewportSection>
        <ViewportSection anchorId="standards">
          <StandardsSection />
        </ViewportSection>
        <ViewportSection anchorId="knowledge">
          <KnowledgeSection />
        </ViewportSection>
        <ViewportSection anchorId="story" minHeight="min-h-[640px]">
          <BrandStory />
        </ViewportSection>
      </main>
      <Footer />
    </div>
  );
}

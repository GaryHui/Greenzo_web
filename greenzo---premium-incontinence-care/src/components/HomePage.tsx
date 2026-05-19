import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';

const QualitySection = lazy(() => import('./QualitySection'));
const GallerySection = lazy(() => import('./GallerySection'));
const ProductSection = lazy(() => import('./ProductSection'));
const StandardsSection = lazy(() => import('./StandardsSection'));
const KnowledgeSection = lazy(() => import('./KnowledgeSection'));
const BrandStory = lazy(() => import('./BrandStory'));

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

export default function HomePage() {
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

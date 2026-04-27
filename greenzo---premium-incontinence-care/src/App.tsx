import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import BrandStory from './components/BrandStory';
import QualitySection from './components/QualitySection';
import GallerySection from './components/GallerySection';
import StandardsSection from './components/StandardsSection';
import Footer from './components/Footer';

export default function App() {
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

import heroMainImage from './photo/new1.png';
import diaperImage from './photo/Adult/Adult2.png';
import padImage from './photo/Adult/4.png';
import softTissueImage from './photo/Dairy/D1.png';
import wipeImage from './photo/Personal/P1.png';
import brandStoryImage from './photo/14d39408-f98b-449a-ad77-38595a108046.png';

const detailImages = Object.entries(
  import.meta.glob('./photo/Detail/Picture*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' }),
  )
  .map(([, src]) => src);

const productDetailImagesByProductId = (() => {
  const entries = Object.entries(
    import.meta.glob('./photo/ProductDetails/*/*.{png,jpg,jpeg,webp,avif}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>,
  );

  const grouped: Record<string, Array<[string, string]>> = {};
  for (const [path, src] of entries) {
    const match = path.match(/\/ProductDetails\/([^/]+)\//);
    if (!match) continue;
    const productId = match[1];
    (grouped[productId] ??= []).push([path, src]);
  }

  const result: Record<string, string[]> = {};
  for (const [productId, items] of Object.entries(grouped)) {
    result[productId] = items
      .sort(([pathA], [pathB]) =>
        pathA.localeCompare(pathB, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      )
      .map(([, src]) => src);
  }
  return result;
})();

/**
 * Greenzo Asset Configuration
 * Use this file to manage all media content (images, videos).
 * You can use remote URLs or local paths from the public directory.
 */

export const ASSET_CONFIG = {
  hero: {
    mainImage: heroMainImage,
  },
  
  products: {
    diaper: diaperImage,
    pad: padImage,
    softTissue: softTissueImage,
    wipe: wipeImage,
  },

  productDetails: productDetailImagesByProductId,

  gallery: [
    ...detailImages,
  ],

  videos: {
    mainDemo: {
      thumbnail: "https://images.unsplash.com/photo-1544178170-c97216dc8f3e?auto=format&fit=crop&q=80&w=800",
      url: "#", // Replace with your video URL
    }
  },

  brand: {
    story: brandStoryImage,
  }
};

import heroMainImage from './photo/new1.png';
import diaperImage from './photo/Adult/Adult2.png';
import padImage from './photo/Adult/4.png';
import softTissueImage from './photo/Dairy/D1.png';
import wipeImage from './photo/Personal/P1.png';
import brandStoryImage from './photo/14d39408-f98b-449a-ad77-38595a108046.png';
import detailImage1 from './photo/Detail/Picture1.png';
import detailImage2 from './photo/Detail/Picture2.png';
import detailImage3 from './photo/Detail/Picture3.png';
import detailImage4 from './photo/Detail/Picture4.png';

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

  gallery: [
    detailImage1,
    detailImage2,
    detailImage3,
    detailImage4,
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

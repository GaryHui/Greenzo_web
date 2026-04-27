import heroMainImage from './photo/1c6a56ee-2360-44e4-bbb3-f61122079614.png';
import diaperImage from './photo/Adult/Adult2.png';
import padImage from './photo/Adult/4.png';
import softTissueImage from './photo/Dairy/D1.png';
import wipeImage from './photo/Personal/P1.png';
import brandStoryImage from './photo/14d39408-f98b-449a-ad77-38595a108046.png';

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
    "https://images.unsplash.com/photo-1583912267550-d44d4a3c5a71?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505751172107-5962250d33c9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516733725897-1aa73b87c7e8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576014457313-094191fe7db8?auto=format&fit=crop&q=80&w=800",
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

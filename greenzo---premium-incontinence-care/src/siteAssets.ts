import heroMainImage from './photo/hero-opening-care.gif';
import heroStillImage from './photo/hero-opening-care.jpg';
import fallbackBrandStoryImage from './photo/story-lixia.jpg';
import { getCurrentSolarTermImage } from './seasonalSolarTerms';

const brandStoryImage = getCurrentSolarTermImage() ?? fallbackBrandStoryImage;

export { heroMainImage, heroStillImage, brandStoryImage };

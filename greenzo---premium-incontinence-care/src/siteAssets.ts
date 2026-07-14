import heroMainImage from './photo/hero-seasonal.jpg';
import fallbackBrandStoryImage from './photo/story-lixia.jpg';
import { getCurrentSolarTermImage } from './seasonalSolarTerms';

const brandStoryImage = getCurrentSolarTermImage() ?? fallbackBrandStoryImage;

export { heroMainImage, brandStoryImage };

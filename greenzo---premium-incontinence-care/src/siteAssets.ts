import heroMainImage from './photo/hero-seasonal.jpg';
import fallbackBrandStoryImage from './photo/story-lixia.jpg';
import { getTodaysSolarTermImage } from './seasonalSolarTerms';

const brandStoryImage = getTodaysSolarTermImage() ?? fallbackBrandStoryImage;

export { heroMainImage, brandStoryImage };

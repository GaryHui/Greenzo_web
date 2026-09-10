import heroMainImage from './photo/hero-adult-care.gif';
import heroStillImage from './photo/hero-adult-care.jpg';
import fallbackBrandStoryImage from './photo/story-lixia.jpg';
import { getCurrentSolarTermImage } from './seasonalSolarTerms';

const brandStoryImage = getCurrentSolarTermImage() ?? fallbackBrandStoryImage;

export { heroMainImage, heroStillImage, brandStoryImage };

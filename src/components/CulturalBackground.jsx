import './CulturalBackground.css';

// Import images directly so Vite bundles them properly
import hillsImg from '../assets/culture/nature/rolling-green-hills.jpg';
import meadowImg from '../assets/culture/nature/misty-meadow-hills.jpg';
import teaImg from '../assets/culture/nature/tea-leaves.jpg';

/**
 * CulturalBackground
 * 
 * Provides a subtle, culturally adapted scenic background for main app screens.
 * Designed for accessibility: strong translucent overlay, subtle blur, and
 * fallback behavior for prefers-reduced-motion.
 */
export default function CulturalBackground({ variant = 'home', children }) {
  let image;
  switch (variant) {
    case 'home':
      image = hillsImg;
      break;
    case 'landing':
      image = meadowImg;
      break;
    case 'progress':
      image = teaImg;
      break;
    default:
      image = hillsImg;
  }

  return (
    <div className="cultural-bg-wrapper">
      <div 
        className="cultural-bg-image" 
        style={{ backgroundImage: `url(${image})` }} 
        aria-hidden="true" 
      />
      <div className="cultural-bg-overlay" aria-hidden="true" />
      <div className="cultural-bg-content">
        {children}
      </div>
    </div>
  );
}

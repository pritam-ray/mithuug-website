import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when the route changes.
 * This ensures users always start at the top when navigating to a new page,
 * preventing issues where users remain at their previous scroll position
 * (e.g., in the footer when clicking a link).
 * 
 * Usage: Place this component inside BrowserRouter in App.tsx
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly when route changes
    window.scrollTo(0, 0);
    
    // Alternative smooth scroll (uncomment if preferred):
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]); // Runs whenever the route pathname changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;

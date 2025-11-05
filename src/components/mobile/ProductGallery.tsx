import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  images, 
  productName
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Haptic feedback
  const hapticFeedback = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Open lightbox at specific image
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    hapticFeedback(10);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    hapticFeedback(10);
    // Restore body scroll
    document.body.style.overflow = '';
  };

  // Handle keyboard navigation in lightbox
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isLightboxOpen) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Navigate to previous image
  const goToPrev = () => {
    const newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1;
    setLightboxIndex(newIndex);
    hapticFeedback(10);
  };

  // Navigate to next image
  const goToNext = () => {
    const newIndex = lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0;
    setLightboxIndex(newIndex);
    hapticFeedback(10);
  };

  // Add keyboard listener
  React.useEffect(() => {
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown as any);
      return () => window.removeEventListener('keydown', handleKeyDown as any);
    }
  }, [isLightboxOpen, lightboxIndex]);

  return (
    <>
      {/* Main Gallery */}
      <div className="relative w-full">
        {/* Simple Image Display - No Swiper */}
        <div 
          className="w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-ivory flex items-center justify-center relative"
        >
          <img
            src={images[activeIndex] || images[0]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            className="object-contain cursor-pointer w-full h-full"
            onClick={() => openLightbox(activeIndex)}
            loading="eager"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-10 bg-black/50 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-sm font-semibold">
              {activeIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Fullscreen Button */}
          <button
            onClick={() => openLightbox(activeIndex)}
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all active:scale-95"
            aria-label="View fullscreen"
          >
            <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-2 md:mt-4 flex gap-1.5 md:gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                hapticFeedback(10);
              }}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? 'border-ochre shadow-md scale-105'
                  : 'border-ochre-100 hover:border-ochre-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all active:scale-95 touch-target"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all active:scale-95 touch-target"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all active:scale-95 touch-target"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}

            {/* Lightbox Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex]}
                alt={`${productName} - Image ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Swipe Hint - Mobile Only */}
            <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold">
              Swipe to navigate
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;

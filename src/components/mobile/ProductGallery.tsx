import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, Zoom, Thumbs } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  images, 
  productName
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);

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
        {/* Main Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Zoom, Thumbs]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          zoom={{
            maxRatio: 3,
            minRatio: 1,
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            hapticFeedback(10);
          }}
          className="w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-ivory"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <div className="swiper-zoom-container w-full h-full">
                <img
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => openLightbox(index)}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons - Hidden on Mobile */}
        <button
          className="swiper-button-prev-custom hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-chocolate" />
        </button>
        <button
          className="swiper-button-next-custom hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-chocolate" />
        </button>

        {/* Zoom Hint - Mobile Only */}
        <div className="md:hidden absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1">
          <ZoomIn className="w-4 h-4" />
          <span>Pinch to zoom</span>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => openLightbox(activeIndex)}
          className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all active:scale-95"
          aria-label="View fullscreen"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4">
          <Swiper
            modules={[Thumbs]}
            spaceBetween={8}
            slidesPerView={4}
            breakpoints={{
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 7 },
            }}
            watchSlidesProgress
            onSwiper={setThumbsSwiper}
            className="thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    activeIndex === index
                      ? 'border-ochre shadow-md scale-105'
                      : 'border-ochre-100 hover:border-ochre-300'
                  }`}
                  onClick={() => {
                    mainSwiperRef.current?.slideTo(index);
                    hapticFeedback(10);
                  }}
                >
                  <img
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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

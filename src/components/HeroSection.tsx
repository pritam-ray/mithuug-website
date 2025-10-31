import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  variant?: 'A' | 'B' | 'C';
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  backgroundImage?: string;
  showScrollIndicator?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  variant = 'A',
  title,
  subtitle,
  ctaPrimary = 'Order Your First Box',
  ctaSecondary = 'Explore Our Journey',
  // backgroundImage = '/images/hero-bg.webp', // Reserved for future use
  showScrollIndicator = true,
}) => {
  // Hero copy variants from content system
  const heroVariants = {
    A: {
      title: 'GUD vibes, pure nostalgia 🍯',
      subtitle: 'Handcrafted Til-Gud bites that bring back childhood memories — made with pure jaggery, toasted sesame, and zero guilt.',
    },
    B: {
      title: 'Sesame. Jaggery. Nostalgia.',
      subtitle: 'The GUD Bites you grew up with — now handcrafted fresh, modern, and guilt-free.',
    },
    C: {
      title: 'The til-gud you grew up with. Now better.',
      subtitle: 'Remember those golden winter evenings when Nani would slip you a piece of til-gud? We\'ve bottled it.',
    },
  };

  const selectedVariant = heroVariants[variant];
  const displayTitle = title || selectedVariant.title;
  const displaySubtitle = subtitle || selectedVariant.subtitle;

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-ivory-100 via-ivory-50 to-ochre-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #C6862E 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-ochre-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000" />

      {/* Content Container */}
      <div className="relative z-10 section-container text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-ochre" />
          <span className="text-sm font-semibold text-chocolate-800">
            Artisan Til-Gud Bites | Handcrafted Daily | Station-to-Snack Freshness
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-chocolate-900 mb-6 leading-tight animate-fadeIn">
          {displayTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-chocolate-700 max-w-3xl mx-auto mb-10 leading-relaxed animate-fadeIn animation-delay-200">
          {displaySubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn animation-delay-400">
          <Link
            to="/shop"
            className="btn-primary text-lg px-8 py-4 flex items-center gap-2 w-full sm:w-auto"
          >
            {ctaPrimary}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/about"
            className="btn-outline text-lg px-8 py-4 w-full sm:w-auto"
          >
            {ctaSecondary}
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-chocolate-600 animate-fadeIn animation-delay-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-ochre" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">100% Natural Jaggery</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-ochre" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Handcrafted Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-ochre" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Free Shipping ₹499+</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-chocolate-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-chocolate-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Data Attribute for A/B Testing */}
      <div className="sr-only" data-hero-variant={variant} />
    </section>
  );
};

export default HeroSection;

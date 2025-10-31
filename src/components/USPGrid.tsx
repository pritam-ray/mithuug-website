import React from 'react';
import { Leaf, Heart, ChefHat } from 'lucide-react';

interface USP {
  title: string;
  supportLine: string;
  icon: 'leaf' | 'heart' | 'chef';
  emoji: string;
}

interface USPGridProps {
  usps?: USP[];
}

const iconComponents = {
  leaf: Leaf,
  heart: Heart,
  chef: ChefHat,
};

export const USPGrid: React.FC<USPGridProps> = ({ usps }) => {
  // Default USPs from content system
  const defaultUSPs: USP[] = [
    {
      title: '100% Natural Sweetness',
      supportLine: 'Only pure jaggery — no refined sugar, no guilt, just GUD vibes.',
      icon: 'leaf',
      emoji: '🍯',
    },
    {
      title: 'Handcrafted in Small Batches',
      supportLine: 'Each batch made fresh at our Mitthu Express kitchen with love.',
      icon: 'chef',
      emoji: '👨‍🍳',
    },
    {
      title: 'Nostalgia You Can Taste',
      supportLine: 'Traditional recipes reimagined for modern snacking — taste the memories.',
      icon: 'heart',
      emoji: '❤️',
    },
  ];

  const displayUSPs = usps || defaultUSPs;

  return (
    <section className="section-container bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-chocolate-900 mb-4">
          Why Choose MitthuuG?
        </h2>
        <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
          From our Mitthu Express kitchen to your chai-time ritual — here's what makes us special
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayUSPs.map((usp, index) => {
          const IconComponent = iconComponents[usp.icon];
          
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-ivory-50 to-white rounded-2xl p-8 shadow-md hover:shadow-mitthuug transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon Circle */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-mitthuug shadow-mitthuug group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-playfair font-bold text-chocolate-900 mb-3 group-hover:text-ochre transition-colors">
                {usp.title}
              </h3>
              <p className="text-chocolate-600 leading-relaxed">
                {usp.supportLine}
              </p>

              {/* Decorative Emoji */}
              <div className="absolute top-6 right-6 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                {usp.emoji}
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-ochre opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-chocolate-700 mb-4">
          Join thousands of happy snackers on the Mitthu Express journey
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-chocolate-600">
          <span className="flex items-center gap-1">
            <span className="text-gold text-lg">★★★★★</span>
            <span className="font-semibold">4.9/5</span>
          </span>
          <span className="text-chocolate-400">•</span>
          <span>10,000+ Happy Customers</span>
          <span className="text-chocolate-400">•</span>
          <span>50,000+ Orders Delivered</span>
        </div>
      </div>
    </section>
  );
};

export default USPGrid;

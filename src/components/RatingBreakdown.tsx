import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RatingBreakdownProps {
  productId: string;
}

interface RatingData {
  rating: number;
  count: number;
  percentage: number;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ productId }) => {
  const [breakdown, setBreakdown] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatingBreakdown();
  }, [productId]);

  const loadRatingBreakdown = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_rating_breakdown', { p_product_id: productId });

      if (error) throw error;

      // Fill in missing ratings with 0 count
      const fullBreakdown: RatingData[] = [];
      for (let i = 5; i >= 1; i--) {
        const existing = data?.find((d: RatingData) => d.rating === i);
        fullBreakdown.push({
          rating: i,
          count: existing?.count || 0,
          percentage: existing?.percentage || 0,
        });
      }

      setBreakdown(fullBreakdown);
    } catch (error) {
      console.error('Error loading rating breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReviews = breakdown.reduce((sum, item) => sum + item.count, 0);
  const averageRating = totalReviews > 0
    ? breakdown.reduce((sum, item) => sum + (item.rating * item.count), 0) / totalReviews
    : 0;

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-12 h-4 bg-chocolate-200 rounded" />
            <div className="flex-1 h-4 bg-chocolate-200 rounded" />
            <div className="w-12 h-4 bg-chocolate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-ochre-100">
      <h3 className="text-xl font-playfair font-bold text-chocolate-900 mb-4">
        Rating Breakdown
      </h3>

      {/* Average Rating Display */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-chocolate-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-ochre mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.round(averageRating) ? 'fill-gold text-gold' : 'text-chocolate-300'}
              />
            ))}
          </div>
          <div className="text-xs text-chocolate-600">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>

      {/* Rating Bars */}
      <div className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.rating} className="flex items-center gap-3">
            {/* Star Count */}
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-semibold text-chocolate-900">
                {item.rating}
              </span>
              <Star size={14} className="fill-gold text-gold" />
            </div>

            {/* Progress Bar */}
            <div className="flex-1 bg-chocolate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ochre to-gold transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            {/* Count */}
            <div className="w-16 text-right">
              <span className="text-sm text-chocolate-600">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Reviews State */}
      {totalReviews === 0 && (
        <div className="text-center py-8">
          <div className="text-chocolate-400 mb-2">
            <Star size={48} className="mx-auto opacity-20" />
          </div>
          <p className="text-chocolate-600">No reviews yet</p>
          <p className="text-sm text-chocolate-500 mt-1">
            Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default RatingBreakdown;

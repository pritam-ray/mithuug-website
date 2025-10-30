import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types/database';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onReviewSubmit: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  reviews,
  onReviewSubmit,
}) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          product_id: productId,
          user_id: user.id,
          rating,
          title,
          comment,
        },
      ]);

      if (error) throw error;

      setTitle('');
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      onReviewSubmit();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  return (
    <div className="border-t border-stone-200 pt-16">
      <div className="mb-12">
        <h2 className="text-3xl font-light tracking-wide text-stone-900 mb-8">
          Customer Reviews
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-stone-50 p-8 rounded-lg">
            <div className="text-center mb-6">
              <div className="text-5xl font-light text-stone-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-stone-600">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm text-stone-600 w-12">{rating} star</span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400"
                      style={{
                        width: `${
                          reviews.length > 0
                            ? (ratingCounts[index] / reviews.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-stone-600 w-8">
                    {ratingCounts[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <div className="flex items-center justify-center">
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors tracking-wide"
                >
                  WRITE A REVIEW
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                      placeholder="Sum up your review"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-2">
                      Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                      placeholder="Share your experience with this product"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-stone-900 text-white py-3 rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 border border-stone-300 rounded-full hover:bg-stone-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-stone-200 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="font-medium text-stone-900">{review.title}</h4>
              </div>
              <span className="text-sm text-stone-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed mb-3">{review.comment}</p>
            <p className="text-sm text-stone-500">
              By {review.user_profile?.full_name || 'Anonymous'}
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-center text-stone-600 py-12">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

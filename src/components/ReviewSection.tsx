import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ButtonLoader, InlineLoader } from './LoadingComponents';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user?: { full_name: string };
}

interface ReviewSectionProps {
  product_id: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ product_id }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadReviews();
  }, [product_id]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('reviews')
        .select('*, user:profiles(full_name)')
        .eq('product_id', product_id)
        .order('created_at', { ascending: false });
      if (data) setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id,
        user_id: user.id,
        rating,
        title,
        comment,
      });
      if (!error) {
        setRating(0);
        setTitle('');
        setComment('');
        setShowReviewForm(false);
        loadReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  if (loading) {
    return <InlineLoader text="Loading reviews..." />;
  }

  return (
    <div className="space-y-8">
      <div className="border-t border-stone-200 pt-8">
        <h2 className="text-3xl font-light text-stone-900 dark:text-gray-100 mb-6">Customer Reviews</h2>
        <div className="bg-stone-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-4xl font-light text-stone-900">{averageRating.toFixed(1)}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-6 h-6 ${star <= averageRating ? 'fill-ochre-500 text-ochre-500' : 'text-stone-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-stone-600">{reviews.length} reviews</p>
            </div>
            {user && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="bg-ochre-500 text-white px-6 py-3 rounded-full hover:bg-ochre-600 transition-colors">Write a Review</button>
            )}
          </div>
        </div>
        {showReviewForm && (
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-light text-stone-900 mb-4">Write Your Review</h3>
            <div className="mb-4">
              <label className="block text-sm text-stone-700 mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none">
                    <Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'fill-ochre-500 text-ochre-500' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-stone-700 mb-2">Review Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-ochre-500 focus:border-transparent" placeholder="Sum up your experience" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-stone-700 mb-2">Your Review</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-ochre-500 focus:border-transparent" placeholder="Tell us what you think" required />
            </div>
            <div className="flex space-x-3">
              <button 
                type="submit" 
                disabled={submitting || rating === 0} 
                className="bg-ochre-500 text-white px-6 py-3 rounded-full hover:bg-ochre-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <ButtonLoader /> : 'Submit Review'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowReviewForm(false); setRating(0); setTitle(''); setComment(''); }} 
                className="border border-stone-300 text-stone-700 px-6 py-3 rounded-full hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-stone-600 py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-stone-200 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'fill-ochre-500 text-ochre-500' : 'text-stone-300'}`} />
                      ))}
                    </div>
                    <h4 className="font-medium text-stone-900">{review.title}</h4>
                  </div>
                  <span className="text-sm text-stone-500">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-stone-700 mb-2">{review.comment}</p>
                <p className="text-sm text-stone-500">By {review.user?.full_name || 'Anonymous'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;

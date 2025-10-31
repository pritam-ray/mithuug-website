import React, { useState } from 'react';import React, { useState } from 'react';

import { Star, ThumbsUp, MessageCircle, CheckCircle, User as UserIcon } from 'lucide-react';import { Star } from 'lucide-react';

import { useAuth } from '../context/AuthContext';import { supabase } from '../lib/supabase';

import { useAuth } from '../context/AuthContext';

interface Review {import { Review } from '../types/database';

  id: number;

  user_name: string;interface ReviewSectionProps {

  rating: number;  productId: string;

  title: string;  reviews: Review[];

  comment: string;  onReviewSubmit: () => void;

  created_at: string;}

  helpful_count: number;

  verified_purchase: boolean;const ReviewSection: React.FC<ReviewSectionProps> = ({

}  productId,

  reviews,

interface ReviewSectionProps {  onReviewSubmit,

  productId?: string;}) => {

}  const { user } = useAuth();

  const [showReviewForm, setShowReviewForm] = useState(false);

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {  const [rating, setRating] = useState(5);

  const { user } = useAuth();  const [title, setTitle] = useState('');

  const [showReviewForm, setShowReviewForm] = useState(false);  const [comment, setComment] = useState('');

  const [rating, setRating] = useState(0);  const [submitting, setSubmitting] = useState(false);

  const [hoverRating, setHoverRating] = useState(0);

  const [title, setTitle] = useState('');  const handleSubmit = async (e: React.FormEvent) => {

  const [comment, setComment] = useState('');    e.preventDefault();

  const [submitting, setSubmitting] = useState(false);    if (!user) return;



  // Mock reviews data    setSubmitting(true);

  const mockReviews: Review[] = [    try {

    {      const { error } = await supabase.from('reviews').insert([

      id: 1,        {

      user_name: 'Priya Sharma',          product_id: productId,

      rating: 5,          user_id: user.id,

      title: 'Absolutely Divine!',          rating,

      comment: 'These til-gud bites are amazing! The perfect balance of sweetness and sesame flavor. Reminds me of my grandmother\'s homemade til-gud. Will definitely order again!',          title,

      created_at: '2025-10-25',          comment,

      helpful_count: 12,        },

      verified_purchase: true      ]);

    },

    {      if (error) throw error;

      id: 2,

      user_name: 'Rajesh Kumar',      setTitle('');

      rating: 5,      setComment('');

      title: 'Best Quality Ingredients',      setRating(5);

      comment: 'You can taste the quality! Premium sesame seeds and pure jaggery. No artificial flavors. Great for gifting during festivals.',      setShowReviewForm(false);

      created_at: '2025-10-20',      onReviewSubmit();

      helpful_count: 8,    } catch (error) {

      verified_purchase: true      console.error('Error submitting review:', error);

    },    } finally {

    {      setSubmitting(false);

      id: 3,    }

      user_name: 'Anita Desai',  };

      rating: 4,

      title: 'Delicious but pricey',  const averageRating =

      comment: 'Taste is excellent, packaging is beautiful. Slightly expensive but worth it for the quality. Would recommend for special occasions.',    reviews.length > 0

      created_at: '2025-10-15',      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

      helpful_count: 5,      : 0;

      verified_purchase: false

    }  const ratingCounts = [5, 4, 3, 2, 1].map(

  ];    (rating) => reviews.filter((r) => r.rating === rating).length

  );

  const averageRating = mockReviews.reduce((acc, rev) => acc + rev.rating, 0) / mockReviews.length;

    return (

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({    <div className="border-t border-stone-200 pt-16">

    stars,      <div className="mb-12">

    count: mockReviews.filter(r => r.rating === stars).length,        <h2 className="text-3xl font-light tracking-wide text-stone-900 mb-8">

    percentage: (mockReviews.filter(r => r.rating === stars).length / mockReviews.length) * 100          Customer Reviews

  }));        </h2>



  const handleSubmit = async (e: React.FormEvent) => {        <div className="grid md:grid-cols-2 gap-8 mb-8">

    e.preventDefault();          <div className="bg-stone-50 p-8 rounded-lg">

    if (!user) {            <div className="text-center mb-6">

      alert('Please login to submit a review');              <div className="text-5xl font-light text-stone-900 mb-2">

      return;                {averageRating.toFixed(1)}

    }              </div>

              <div className="flex items-center justify-center space-x-1 mb-2">

    setSubmitting(true);                {[...Array(5)].map((_, i) => (

                      <Star

    // Simulate submission                    key={i}

    setTimeout(() => {                    className={`w-5 h-5 ${

      setSubmitting(false);                      i < Math.round(averageRating)

      setShowReviewForm(false);                        ? 'fill-amber-400 text-amber-400'

      setRating(0);                        : 'text-stone-300'

      setTitle('');                    }`}

      setComment('');                  />

      alert('Review submitted successfully! Thank you for your feedback.');                ))}

    }, 1500);              </div>

  };              <p className="text-stone-600">

                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}

  const renderStars = (count: number, size: string = 'w-5 h-5') => {              </p>

    return (            </div>

      <div className="flex items-center space-x-1">

        {[1, 2, 3, 4, 5].map((star) => (            <div className="space-y-2">

          <Star              {[5, 4, 3, 2, 1].map((rating, index) => (

            key={star}                <div key={rating} className="flex items-center space-x-3">

            className={`${size} ${                  <span className="text-sm text-stone-600 w-12">{rating} star</span>

              star <= count                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">

                ? 'fill-ochre-500 text-ochre-500'                    <div

                : 'text-ochre-200'                      className="h-full bg-amber-400"

            }`}                      style={{

          />                        width: `${

        ))}                          reviews.length > 0

      </div>                            ? (ratingCounts[index] / reviews.length) * 100

    );                            : 0

  };                        }%`,

                      }}

  return (                    />

    <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg">                  </div>

      <h2 className="text-3xl font-playfair font-bold text-chocolate-900 mb-6">                  <span className="text-sm text-stone-600 w-8">

        Customer Reviews                    {ratingCounts[index]}

      </h2>                  </span>

                </div>

      {/* Rating Summary */}              ))}

      <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-ochre-100">            </div>

        <div className="text-center md:text-left">          </div>

          <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">

            <span className="text-6xl font-playfair font-bold text-ochre-600">          {user && (

              {averageRating.toFixed(1)}            <div className="flex items-center justify-center">

            </span>              {!showReviewForm ? (

            <div>                <button

              {renderStars(Math.round(averageRating), 'w-6 h-6')}                  onClick={() => setShowReviewForm(true)}

              <p className="text-sm text-chocolate-600 mt-1">                  className="px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors tracking-wide"

                Based on {mockReviews.length} reviews                >

              </p>                  WRITE A REVIEW

            </div>                </button>

          </div>              ) : (

        </div>                <form onSubmit={handleSubmit} className="w-full space-y-4">

                  <div>

        <div className="space-y-2">                    <label className="block text-sm font-medium text-stone-900 mb-2">

          {ratingDistribution.map(({ stars, count, percentage }) => (                      Rating

            <div key={stars} className="flex items-center space-x-3">                    </label>

              <span className="text-sm font-medium text-chocolate-700 w-12">                    <div className="flex space-x-2">

                {stars} star                      {[1, 2, 3, 4, 5].map((star) => (

              </span>                        <button

              <div className="flex-1 bg-ochre-100 rounded-full h-3 overflow-hidden">                          key={star}

                <div                          type="button"

                  className="bg-gradient-to-r from-ochre-500 to-ochre-600 h-full transition-all"                          onClick={() => setRating(star)}

                  style={{ width: `${percentage}%` }}                          className="focus:outline-none"

                ></div>                        >

              </div>                          <Star

              <span className="text-sm text-chocolate-600 w-8">{count}</span>                            className={`w-8 h-8 ${

            </div>                              star <= rating

          ))}                                ? 'fill-amber-400 text-amber-400'

        </div>                                : 'text-stone-300'

      </div>                            }`}

                          />

      {/* Write Review Button */}                        </button>

      {!showReviewForm && (                      ))}

        <div className="mb-8">                    </div>

          <button                  </div>

            onClick={() => setShowReviewForm(true)}

            className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"                  <div>

          >                    <label className="block text-sm font-medium text-stone-900 mb-2">

            Write a Review                      Title

          </button>                    </label>

        </div>                    <input

      )}                      type="text"

                      value={title}

      {/* Review Form */}                      onChange={(e) => setTitle(e.target.value)}

      {showReviewForm && (                      required

        <div className="bg-ochre-50 rounded-2xl p-6 mb-8 border-2 border-ochre-200">                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

          <h3 className="text-xl font-playfair font-bold text-chocolate-900 mb-4">                      placeholder="Sum up your review"

            Write Your Review                    />

          </h3>                  </div>

          

          <form onSubmit={handleSubmit} className="space-y-6">                  <div>

            {/* Star Rating */}                    <label className="block text-sm font-medium text-stone-900 mb-2">

            <div>                      Review

              <label className="block text-sm font-bold text-chocolate-900 mb-2">                    </label>

                Your Rating *                    <textarea

              </label>                      value={comment}

              <div className="flex items-center space-x-2">                      onChange={(e) => setComment(e.target.value)}

                {[1, 2, 3, 4, 5].map((star) => (                      required

                  <button                      rows={4}

                    key={star}                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"

                    type="button"                      placeholder="Share your experience with this product"

                    onClick={() => setRating(star)}                    />

                    onMouseEnter={() => setHoverRating(star)}                  </div>

                    onMouseLeave={() => setHoverRating(0)}

                    className="focus:outline-none transition-transform hover:scale-110"                  <div className="flex space-x-3">

                  >                    <button

                    <Star                      type="submit"

                      className={`w-8 h-8 ${                      disabled={submitting}

                        star <= (hoverRating || rating)                      className="flex-1 bg-stone-900 text-white py-3 rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50"

                          ? 'fill-ochre-500 text-ochre-500'                    >

                          : 'text-ochre-300'                      {submitting ? 'Submitting...' : 'Submit Review'}

                      }`}                    </button>

                    />                    <button

                  </button>                      type="button"

                ))}                      onClick={() => setShowReviewForm(false)}

                {rating > 0 && (                      className="px-6 py-3 border border-stone-300 rounded-full hover:bg-stone-100 transition-colors"

                  <span className="ml-3 text-sm font-medium text-chocolate-700">                    >

                    {rating === 5 && '🌟 Excellent!'}                      Cancel

                    {rating === 4 && '😊 Great!'}                    </button>

                    {rating === 3 && '👍 Good'}                  </div>

                    {rating === 2 && '😐 Okay'}                </form>

                    {rating === 1 && '😞 Poor'}              )}

                  </span>            </div>

                )}          )}

              </div>        </div>

            </div>      </div>



            {/* Review Title */}      <div className="space-y-6">

            <div>        {reviews.map((review) => (

              <label className="block text-sm font-bold text-chocolate-900 mb-2">          <div key={review.id} className="border-b border-stone-200 pb-6 last:border-0">

                Review Title *            <div className="flex items-start justify-between mb-3">

              </label>              <div>

              <input                <div className="flex items-center space-x-1 mb-2">

                type="text"                  {[...Array(5)].map((_, i) => (

                required                    <Star

                value={title}                      key={i}

                onChange={(e) => setTitle(e.target.value)}                      className={`w-4 h-4 ${

                className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all bg-white"                        i < review.rating

                placeholder="Sum up your experience"                          ? 'fill-amber-400 text-amber-400'

              />                          : 'text-stone-300'

            </div>                      }`}

                    />

            {/* Review Comment */}                  ))}

            <div>                </div>

              <label className="block text-sm font-bold text-chocolate-900 mb-2">                <h4 className="font-medium text-stone-900">{review.title}</h4>

                Your Review *              </div>

              </label>              <span className="text-sm text-stone-500">

              <textarea                {new Date(review.created_at).toLocaleDateString()}

                required              </span>

                value={comment}            </div>

                onChange={(e) => setComment(e.target.value)}            <p className="text-stone-600 leading-relaxed mb-3">{review.comment}</p>

                rows={5}            <p className="text-sm text-stone-500">

                className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all bg-white resize-none"              By {review.user_profile?.full_name || 'Anonymous'}

                placeholder="Share your thoughts about this product..."            </p>

              />          </div>

            </div>        ))}



            {/* Submit Buttons */}        {reviews.length === 0 && (

            <div className="flex space-x-4">          <p className="text-center text-stone-600 py-12">

              <button            No reviews yet. Be the first to review this product!

                type="submit"          </p>

                disabled={submitting || rating === 0}        )}

                className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-3 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"      </div>

              >    </div>

                {submitting ? 'Submitting...' : 'Submit Review'}  );

              </button>};

              <button

                type="button"export default ReviewSection;

                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setTitle('');
                  setComment('');
                }}
                className="border-2 border-ochre-300 text-ochre-700 px-8 py-3 rounded-full hover:bg-ochre-100 transition-all font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="border-2 border-ochre-100 rounded-2xl p-6 hover:border-ochre-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-bold text-chocolate-900">{review.user_name}</p>
                    {review.verified_purchase && (
                      <span className="flex items-center space-x-1 bg-olive-100 text-olive-700 text-xs px-2 py-1 rounded-full font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>
                  {renderStars(review.rating, 'w-4 h-4')}
                </div>
              </div>
              <p className="text-sm text-chocolate-500">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            <h4 className="font-bold text-chocolate-900 mb-2">{review.title}</h4>
            <p className="text-chocolate-700 mb-4 leading-relaxed">{review.comment}</p>

            <div className="flex items-center space-x-4 pt-4 border-t border-ochre-100">
              <button className="flex items-center space-x-2 text-chocolate-600 hover:text-ochre-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Helpful ({review.helpful_count})
                </span>
              </button>
              <button className="flex items-center space-x-2 text-chocolate-600 hover:text-ochre-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {mockReviews.length > 0 && (
        <div className="text-center mt-8">
          <button className="border-2 border-ochre-300 text-ochre-700 px-8 py-3 rounded-full hover:bg-ochre-50 transition-all font-bold">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

import { useEffect, useState } from 'react';
import { Star, Check, X, Eye, Trash2, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  verified_purchase: boolean;
  is_approved: boolean;
  admin_notes: string | null;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
  product_name?: string;
}

const AdminReviewModerationPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('reviews')
        .select(`
          *,
          products (name),
          users:user_id (email)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('is_approved', false);
      } else if (filter === 'approved') {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedReviews = data?.map((review: any) => ({
        ...review,
        product_name: review.products?.name,
        user_email: review.users?.email,
      })) || [];

      setReviews(formattedReviews);
    } catch (error: any) {
      showToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: string, isApproved: boolean, adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          is_approved: isApproved,
          admin_notes: adminNotes || null,
        })
        .eq('id', reviewId);

      if (error) throw error;

      showToast('success', `Review ${isApproved ? 'approved' : 'rejected'}`);
      loadReviews();
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      showToast('success', 'Review deleted');
      loadReviews();
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      review.title.toLowerCase().includes(searchLower) ||
      review.comment.toLowerCase().includes(searchLower) ||
      review.product_name?.toLowerCase().includes(searchLower) ||
      review.user_email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen pt-4 bg-ivory">
      <SEO 
        title="Review Moderation - Admin - MitthuuG"
        description="Moderate customer reviews"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-playfair font-bold text-chocolate-900 mb-8">
          Review Moderation
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate-400" size={20} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-chocolate-200 rounded-lg focus:border-ochre focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                filter === 'all'
                  ? 'bg-ochre text-white border-ochre'
                  : 'bg-white text-chocolate-600 border-chocolate-200 hover:border-ochre'
              }`}
            >
              <Filter size={20} />
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                filter === 'pending'
                  ? 'bg-ochre text-white border-ochre'
                  : 'bg-white text-chocolate-600 border-chocolate-200 hover:border-ochre'
              }`}
            >
              <Eye size={20} />
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                filter === 'approved'
                  ? 'bg-ochre text-white border-ochre'
                  : 'bg-white text-chocolate-600 border-chocolate-200 hover:border-ochre'
              }`}
            >
              <Check size={20} />
              Approved
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ochre mx-auto" />
            <p className="mt-4 text-chocolate-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-chocolate-600">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 border-2 border-chocolate-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < review.rating ? 'fill-gold text-gold' : 'text-chocolate-300'}
                          />
                        ))}
                      </div>
                      {review.verified_purchase && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          Verified Purchase
                        </span>
                      )}
                      {!review.is_approved && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                          Pending Approval
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-chocolate-900 mb-2">{review.title}</h3>
                    <p className="text-chocolate-700 mb-3">{review.comment}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`Review ${i + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-chocolate-200"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-chocolate-600">
                      <span>Product: <strong>{review.product_name}</strong></span>
                      <span>User: <strong>{review.user_email}</strong></span>
                      <span>Helpful: <strong>{review.helpful_count}</strong></span>
                      <span>Posted: <strong>{new Date(review.created_at).toLocaleDateString()}</strong></span>
                    </div>

                    {review.admin_notes && (
                      <div className="mt-3 p-3 bg-chocolate-50 rounded-lg">
                        <p className="text-sm text-chocolate-600">
                          <strong>Admin Notes:</strong> {review.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    {!review.is_approved && (
                      <button
                        onClick={() => updateReviewStatus(review.id, true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Approve"
                      >
                        <Check size={18} />
                        <span className="hidden md:inline">Approve</span>
                      </button>
                    )}
                    {review.is_approved && (
                      <button
                        onClick={() => updateReviewStatus(review.id, false, 'Unapproved by admin')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        title="Unapprove"
                      >
                        <X size={18} />
                        <span className="hidden md:inline">Unapprove</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewModerationPage;

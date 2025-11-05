import { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { Package, Calendar, Pause, Play, Trash2, X, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

const SubscriptionPage = () => {
  const { subscriptions, loading, pauseSubscription, resumeSubscription, cancelSubscription, deleteSubscription } = useSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const getFrequencyLabel = (frequency: string, customDays?: number | null) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Every 2 Weeks';
      case 'monthly': return 'Monthly';
      case 'custom': return customDays ? `Every ${customDays} days` : 'Custom';
      default: return frequency;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-700' },
    };
    const badge = badges[status] || badges.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} uppercase`}>
        {status}
      </span>
    );
  };

  const handleCancelClick = (subId: string) => {
    setSelectedSubId(subId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedSubId) {
      await cancelSubscription(selectedSubId, cancelReason);
      setShowCancelModal(false);
      setSelectedSubId(null);
      setCancelReason('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-4 bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ochre mx-auto mb-4" />
          <p className="text-chocolate-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 bg-ivory">
      <SEO title="My Subscriptions - MitthuuG" description="Manage your subscription orders" />
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-chocolate-900">My Subscriptions</h1>
            <p className="text-chocolate-600 mt-2">Manage your recurring deliveries and save 10%</p>
          </div>
          <Link to="/shop" className="bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors">
            Browse Products
          </Link>
        </div>

        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <Package size={64} className="mx-auto text-chocolate-300 mb-4" />
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-2">No Active Subscriptions</h2>
            <p className="text-chocolate-600 mb-6">Subscribe & save 10% on your favorite products with auto-delivery</p>
            <Link to="/shop" className="inline-block bg-ochre text-white px-8 py-3 rounded-lg hover:bg-ochre-600 transition-colors">
              Start Subscribing
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-xl p-6 border-2 border-chocolate-200 hover:border-ochre transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={sub.product?.images?.[0] || sub.product?.image_url}
                    alt={sub.product?.name}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-chocolate-900">{sub.product?.name}</h3>
                        <p className="text-sm text-chocolate-600">Quantity: {sub.quantity}</p>
                      </div>
                      {getStatusBadge(sub.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-chocolate-500">Frequency</p>
                        <p className="font-semibold text-chocolate-900 flex items-center gap-1">
                          <RefreshCw size={14} />
                          {getFrequencyLabel(sub.frequency, sub.custom_interval_days)}
                        </p>
                      </div>
                      <div>
                        <p className="text-chocolate-500">Next Delivery</p>
                        <p className="font-semibold text-chocolate-900 flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(sub.next_delivery_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-chocolate-500">Discount</p>
                        <p className="font-semibold text-green-600">{sub.discount_percentage}% off</p>
                      </div>
                      <div>
                        <p className="text-chocolate-500">Total Orders</p>
                        <p className="font-semibold text-chocolate-900">{sub.total_orders_created}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sub.status === 'active' && (
                        <button
                          onClick={() => pauseSubscription(sub.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          <Pause size={16} />
                          Pause
                        </button>
                      )}
                      {sub.status === 'paused' && (
                        <button
                          onClick={() => resumeSubscription(sub.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <Play size={16} />
                          Resume
                        </button>
                      )}
                      {(sub.status === 'active' || sub.status === 'paused') && (
                        <button
                          onClick={() => handleCancelClick(sub.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      )}
                      {sub.status === 'cancelled' && (
                        <button
                          onClick={() => deleteSubscription(sub.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Cancel Subscription</h3>
            <p className="text-chocolate-600 mb-4">We're sorry to see you go. Please tell us why you're cancelling (optional):</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-chocolate-200 rounded-lg focus:border-ochre focus:outline-none mb-6"
              rows={4}
              placeholder="Your feedback helps us improve..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSubId(null);
                  setCancelReason('');
                }}
                className="flex-1 px-6 py-3 border-2 border-chocolate-200 text-chocolate-700 rounded-lg hover:bg-chocolate-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;

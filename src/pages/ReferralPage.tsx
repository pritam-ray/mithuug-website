import { useState } from 'react';
import { useReferral } from '../context/ReferralContext';
import { Gift, Share2, Copy, Users, TrendingUp, Award, Plus } from 'lucide-react';
import SEO from '../components/SEO';

const ReferralPage = () => {
  const { referralCodes, referrals, stats, loading, createReferralCode, shareReferralLink, getReferralLink } = useReferral();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(10);

  const handleCreateCode = async () => {
    await createReferralCode(discountPercentage);
    setShowCreateModal(false);
    setDiscountPercentage(10);
  };

  const copyLink = (code: string) => {
    const link = getReferralLink(code);
    navigator.clipboard.writeText(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ochre mx-auto mb-4" />
          <p className="text-chocolate-600">Loading referral program...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-ivory">
      <SEO title="Referral Program - MitthuuG" description="Refer friends and earn rewards" />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ochre to-gold rounded-full mb-4">
            <Gift size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-chocolate-900 mb-4">
            Refer & Earn Rewards
          </h1>
          <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
            Share the sweetness! Refer friends to MitthuuG and both of you get rewarded.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border-2 border-chocolate-200 text-center">
              <Users className="mx-auto mb-3 text-ochre" size={32} />
              <div className="text-3xl font-bold text-chocolate-900 mb-1">{stats.total_referrals}</div>
              <div className="text-sm text-chocolate-600">Total Referrals</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-chocolate-200 text-center">
              <TrendingUp className="mx-auto mb-3 text-green-600" size={32} />
              <div className="text-3xl font-bold text-chocolate-900 mb-1">{stats.completed_referrals}</div>
              <div className="text-sm text-chocolate-600">Completed</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-chocolate-200 text-center">
              <Award className="mx-auto mb-3 text-gold" size={32} />
              <div className="text-3xl font-bold text-chocolate-900 mb-1">₹{stats.total_earnings.toFixed(2)}</div>
              <div className="text-sm text-chocolate-600">Total Earnings</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-chocolate-200 text-center">
              <Share2 className="mx-auto mb-3 text-blue-600" size={32} />
              <div className="text-3xl font-bold text-chocolate-900 mb-1">{stats.total_code_uses}</div>
              <div className="text-sm text-chocolate-600">Code Uses</div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 mb-12 border-2 border-chocolate-200">
          <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ochre text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold text-chocolate-900 mb-2">Create Your Code</h3>
              <p className="text-chocolate-600 text-sm">Generate your unique referral code and share it with friends</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-ochre text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold text-chocolate-900 mb-2">Friends Get Discount</h3>
              <p className="text-chocolate-600 text-sm">Your friends get 10% off on their first order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-ochre text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold text-chocolate-900 mb-2">You Earn Rewards</h3>
              <p className="text-chocolate-600 text-sm">Get 10% of their order value as reward credit</p>
            </div>
          </div>
        </div>

        {/* Referral Codes */}
        <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-chocolate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Your Referral Codes</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors"
            >
              <Plus size={20} />
              Create New Code
            </button>
          </div>

          {referralCodes.length === 0 ? (
            <div className="text-center py-12">
              <Gift size={64} className="mx-auto text-chocolate-300 mb-4" />
              <p className="text-chocolate-600 mb-4">You haven't created any referral codes yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-block bg-ochre text-white px-8 py-3 rounded-lg hover:bg-ochre-600 transition-colors"
              >
                Create Your First Code
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {referralCodes.map((code) => (
                <div key={code.id} className="border-2 border-chocolate-200 rounded-xl p-6 hover:border-ochre transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold font-mono text-ochre">{code.code}</span>
                        {code.is_active ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-chocolate-600">
                        <span>Discount: <strong>{code.discount_percentage}%</strong></span>
                        <span>Uses: <strong>{code.current_uses}{code.max_uses ? `/${code.max_uses}` : ''}</strong></span>
                        {code.expires_at && (
                          <span>Expires: <strong>{new Date(code.expires_at).toLocaleDateString()}</strong></span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyLink(code.code)}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-chocolate-200 text-chocolate-700 rounded-lg hover:bg-chocolate-50 transition-colors"
                        title="Copy Link"
                      >
                        <Copy size={18} />
                        <span className="hidden sm:inline">Copy Link</span>
                      </button>
                      <button
                        onClick={() => shareReferralLink(code.code)}
                        className="flex items-center gap-2 px-4 py-2 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors"
                        title="Share"
                      >
                        <Share2 size={18} />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrals List */}
        {referrals.length > 0 && (
          <div className="bg-white rounded-2xl p-8 border-2 border-chocolate-200">
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-6">Your Referrals</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-chocolate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-chocolate-900 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-chocolate-900 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-chocolate-900 uppercase">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-chocolate-900 uppercase">Your Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chocolate-200">
                  {referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 text-sm text-chocolate-600">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          referral.status === 'completed' ? 'bg-green-100 text-green-700' :
                          referral.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-chocolate-600">
                        {referral.referred_discount_amount}%
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ₹{referral.referrer_reward_amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Create Referral Code</h3>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-chocolate-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-chocolate-200 rounded-lg focus:border-ochre focus:outline-none"
              />
              <p className="text-xs text-chocolate-500 mt-1">Your friends will get this discount on their first order</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border-2 border-chocolate-200 text-chocolate-700 rounded-lg hover:bg-chocolate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCode}
                className="flex-1 px-6 py-3 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors"
              >
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralPage;

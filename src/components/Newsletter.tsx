import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail('');
    }, 1500);
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 text-center border-2 border-green-500">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-playfair font-bold text-green-900 mb-2">
          Welcome to the MitthuuG Family!
        </h3>
        <p className="text-green-700">
          Thank you for subscribing! Check your inbox for a special welcome offer 🎁
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-2xl p-8 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/20 rounded-full p-3">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-3xl font-playfair font-bold text-center mb-3">
          Get Exclusive Offers & Updates
        </h3>
        <p className="text-center text-ochre-50 mb-6 max-w-xl mx-auto">
          Subscribe to our newsletter and get 10% off your first order! Plus, be the first to know about new flavors and festive specials.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 rounded-full text-chocolate-900 placeholder-chocolate-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                required
              />
              {error && (
                <p className="text-red-200 text-sm mt-2 ml-4">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-white text-ochre-600 rounded-full font-bold hover:bg-ochre-50 transition-colors inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              {loading ? (
                <span>Subscribing...</span>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-ochre-100 text-xs mt-4">
          We respect your privacy. Unsubscribe anytime. 🔒
        </p>
      </div>
    </div>
  );
};

export default Newsletter;

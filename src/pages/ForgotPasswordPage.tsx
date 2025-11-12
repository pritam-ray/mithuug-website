import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-ochre-50 to-ivory-100 flex items-center justify-center px-4 py-4">
      <SEO 
        title="Reset Your Password | MitthuuG"
        description="Forgot your password? Reset it here to regain access to your MitthuuG account."
        keywords="reset password, forgot password, account recovery"
      />
      
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate-900 mb-3">
            Forgot Password?
          </h1>
          <p className="text-chocolate-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-ochre-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-3">
                Check Your Email
              </h2>
              <p className="text-chocolate-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-chocolate-500 mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-ochre-600 hover:text-ochre-700 font-medium"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-chocolate-700 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-chocolate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ochre-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-ochre-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ochre-500 to-ochre-600 text-white py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* Back to Login */}
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 text-chocolate-600 hover:text-chocolate-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to login</span>
              </Link>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-chocolate-600">
            Need more help?{' '}
            <Link to="/contact" className="text-ochre-600 hover:text-ochre-700 font-medium">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

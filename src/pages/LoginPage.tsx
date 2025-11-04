import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Sparkles, Leaf, CheckCircle, Eye, EyeOff } from 'lucide-react';
import SEO from '../components/SEO';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get('verified') === 'true') {
      setShowVerifiedMessage(true);
      // Hide message after 10 seconds
      setTimeout(() => setShowVerifiedMessage(false), 10000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      navigate('/account');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    const { error } = await signInWithFacebook();
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-ochre-50 to-ivory-100 flex items-center justify-center px-4 py-12">
      <SEO 
        title="Login to Your Account | MitthuuG"
        description="Sign in to your MitthuuG account to track orders, manage your wishlist, and enjoy exclusive offers on premium Til-Gud sweets."
        keywords="mitthuug login, customer login, account signin"
      />
      
      <div className="max-w-md w-full">
        {/* Email Verified Success Message */}
        {showVerifiedMessage && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-fade-in">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-800">Email Verified Successfully! 🎉</p>
                <p className="text-xs text-green-700 mt-1">
                  You can now login with your credentials below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate-900 mb-3">
            Welcome Back!
          </h1>
          <p className="text-chocolate-600">
            Sign in to enjoy your GUD vibes 🌾
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-ochre-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">{error}</p>
                {error.toLowerCase().includes('email') && error.toLowerCase().includes('confirm') && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-xs text-red-700 mb-2">
                      📧 Please check your email inbox and click the verification link we sent you.
                    </p>
                    <p className="text-xs text-red-600 font-semibold">
                      Already verified? Try:
                    </p>
                    <ul className="text-xs text-red-700 mt-1 ml-4 list-disc">
                      <li>Clear your browser cache and try again</li>
                      <li>Wait a few minutes and retry</li>
                      <li>Contact support if issue persists</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-chocolate-900">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-ochre-600 hover:text-ochre-700 font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ochre-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-ochre-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ochre-500 hover:text-ochre-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ochre-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-chocolate-500 font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center px-4 py-3 border-2 border-ochre-200 rounded-xl hover:border-ochre-400 hover:bg-ochre-50 transition-all font-medium text-chocolate-700"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button
              type="button"
              onClick={handleFacebookSignIn}
              className="flex items-center justify-center px-4 py-3 border-2 border-ochre-200 rounded-xl hover:border-ochre-400 hover:bg-ochre-50 transition-all font-medium text-chocolate-700"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-chocolate-600">
            New to MitthuuG?{' '}
            <Link
              to="/signup"
              className="text-ochre-600 hover:text-ochre-700 font-bold"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-chocolate-600">
            <Leaf className="w-4 h-4 text-olive-600" />
            <span>Premium Natural Ingredients</span>
            <span className="text-ochre-500">•</span>
            <span>FSSAI Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

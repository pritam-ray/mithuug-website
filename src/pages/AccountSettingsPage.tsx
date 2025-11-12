import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Phone, Lock, Save, Eye, EyeOff, MapPin, Bell } from 'lucide-react';
import SEO from '../components/SEO';
import { PageLoader } from '../components/LoadingComponents';
import { useToast } from '../context/ToastContext';

const AccountSettingsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Address form
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user profile
      if (profile) {
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
        setEmail(user.email || '');
        setAddress(profile.address || '');
        setCity(profile.city || '');
        setState(profile.state || '');
        setPincode(profile.pincode || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          email_notifications: emailNotifications,
          order_updates: orderUpdates,
          promotions: promotions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      showToast('Preferences updated successfully!', 'success');
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      showToast(error.message || 'Failed to update preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading settings..." />;
  }

  return (
    <div className="min-h-screen pt-4 bg-stone-50 dark:bg-gray-900">
      <SEO 
        title="Account Settings | MitthuuG"
        description="Manage your MitthuuG account settings, update profile information, change password, and set preferences."
        keywords="account settings, profile settings, change password, mitthuug settings"
      />

      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-stone-900 dark:text-gray-100 mb-2">Account Settings</h1>
          <p className="text-stone-600 dark:text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-ochre" />
              <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100">Profile Information</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg bg-stone-100 dark:bg-gray-900 text-stone-500 dark:text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-stone-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter your phone number"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </form>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-ochre" />
              <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100">Delivery Address</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Address'}</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-ochre" />
              <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100">Change Password</h2>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 border border-stone-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                className="flex items-center space-x-2 px-6 py-3 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5" />
                <span>{saving ? 'Changing...' : 'Change Password'}</span>
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-ochre" />
              <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-gray-100">Email Notifications</p>
                  <p className="text-sm text-stone-600 dark:text-gray-400">Receive general email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ochre/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-ochre"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-gray-100">Order Updates</p>
                  <p className="text-sm text-stone-600 dark:text-gray-400">Get notified about order status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderUpdates}
                    onChange={(e) => setOrderUpdates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ochre/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-ochre"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-gray-100">Promotions & Offers</p>
                  <p className="text-sm text-stone-600 dark:text-gray-400">Receive promotional emails and special offers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promotions}
                    onChange={(e) => setPromotions(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ochre/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-ochre"></div>
                </label>
              </div>
              <button
                onClick={handleUpdatePreferences}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;

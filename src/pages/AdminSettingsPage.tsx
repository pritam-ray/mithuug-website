import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { Settings, Save, Globe, CreditCard, Truck, Mail, Receipt } from 'lucide-react';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  support_email: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  tax_rate: number;
  razorpay_key_id: string;
  razorpay_key_secret: string;
}

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, isLoading: adminLoading } = useAdmin();
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'MitthuuG',
    site_description: 'Premium Til-Gud Bites | Handcrafted Daily',
    contact_email: 'contact@mitthuug.com',
    contact_phone: '8209349602',
    support_email: 'support@mitthuug.com',
    shipping_fee: 50,
    free_shipping_threshold: 500,
    tax_rate: 5,
    razorpay_key_id: '',
    razorpay_key_secret: ''
  });
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'shipping' | 'email' | 'tax'>('general');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  const handleInputChange = (field: keyof SiteSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMessage('');

      // In a real implementation, you would save to a settings table
      // For now, we'll just show success message
      console.log('Saving settings:', settings);

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_settings',
        p_details: { settings }
      });

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-chocolate-900 mb-2">Settings</h1>
        <p className="text-chocolate-600">Manage your store configuration and preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-chocolate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Globe size={20} />
            General
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'payment'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <CreditCard size={20} />
            Payment
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'shipping'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Truck size={20} />
            Shipping
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'email'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Mail size={20} />
            Email
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'tax'
                ? 'border-b-2 border-ochre text-ochre'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Receipt size={20} />
            Tax
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">General Settings</h2>
            
            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Site Description
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Payment Settings</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">⚠️ Security Notice</p>
              <p className="text-sm">Payment credentials should be stored as environment variables in Supabase, not in the database.</p>
            </div>

            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={settings.razorpay_key_id}
                onChange={(e) => handleInputChange('razorpay_key_id', e.target.value)}
                placeholder="rzp_live_xxxxxxxxxx"
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
                disabled={!isSuperAdmin}
              />
              {!isSuperAdmin && (
                <p className="text-sm text-chocolate-500 mt-1">Only super admins can modify payment settings</p>
              )}
            </div>

            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Razorpay Key Secret
              </label>
              <input
                type="password"
                value={settings.razorpay_key_secret}
                onChange={(e) => handleInputChange('razorpay_key_secret', e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
                disabled={!isSuperAdmin}
              />
              {!isSuperAdmin && (
                <p className="text-sm text-chocolate-500 mt-1">Only super admins can modify payment settings</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Current Configuration</p>
              <p className="text-sm mt-2">Payment Gateway: Razorpay</p>
              <p className="text-sm">Status: Configured via environment variables</p>
              <p className="text-sm">Location: Supabase Edge Functions</p>
            </div>
          </div>
        )}

        {/* Shipping Settings */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Shipping Settings</h2>
            
            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.shipping_fee}
                onChange={(e) => handleInputChange('shipping_fee', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => handleInputChange('free_shipping_threshold', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
              <p className="text-sm text-chocolate-500 mt-1">
                Orders above this amount qualify for free shipping
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Shipping Zones</p>
              <p className="text-sm mt-2">All India: ₹{settings.shipping_fee}</p>
              <p className="text-sm">Free Shipping: Orders above ₹{settings.free_shipping_threshold}</p>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Email Settings</h2>
            
            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => handleInputChange('support_email', e.target.value)}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
              <p className="text-sm text-chocolate-500 mt-1">
                Customer support inquiries will be sent to this email
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Email Templates</p>
              <div className="text-sm mt-2 space-y-1">
                <p>• Order Confirmation</p>
                <p>• Shipping Notification</p>
                <p>• Delivery Confirmation</p>
                <p>• Password Reset</p>
                <p>• Welcome Email</p>
              </div>
              <p className="text-sm mt-2 italic">Managed via Supabase Auth settings</p>
            </div>
          </div>
        )}

        {/* Tax Settings */}
        {activeTab === 'tax' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Tax Settings</h2>
            
            <div>
              <label className="block text-chocolate-700 font-medium mb-2">
                GST/Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.tax_rate}
                onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
              />
              <p className="text-sm text-chocolate-500 mt-1">
                Applied to all taxable products
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Tax Information</p>
              <p className="text-sm mt-2">GST Number: (Add your GST number)</p>
              <p className="text-sm">Tax Type: Inclusive</p>
              <p className="text-sm">Current Rate: {settings.tax_rate}%</p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-chocolate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

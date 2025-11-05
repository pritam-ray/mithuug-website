import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { User, Package, Heart, Settings, LogOut, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import { PageLoader } from '../components/LoadingComponents';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
}

interface Wishlist {
  id: string;
  product_id: string;
  product?: {
    name: string;
    image_url: string;
  };
}

const AccountPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [ordersRes, wishlistRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('wishlist_items').select('*, product:products(*)').eq('user_id', user.id),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (wishlistRes.data) setWishlist(wishlistRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <PageLoader text="Loading your account..." />;
  }

  return (
    <div className="min-h-screen pt-8 bg-stone-50 dark:bg-gray-900">
      <SEO 
        title="My Account | MitthuuG"
        description="Manage your MitthuuG account, view orders, track shipments, and update your profile settings."
        keywords="my account, order history, profile settings, mitthuug account"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-stone-900 dark:text-gray-100 mb-2">My Account</h1>
          <p className="text-stone-600 dark:text-gray-400">Welcome back, {profile?.full_name || 'there'}!</p>
        </div>
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-2">
              {/* Admin Dashboard Link - Only for admins */}
              {isAdmin && (
                <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Admin Dashboard</span>
                </Link>
              )}
              <Link to="/account" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-stone-100 dark:bg-gray-700 text-stone-900 dark:text-gray-100">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link to="/account/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 dark:hover:bg-gray-700 text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-gray-100 transition-colors">
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </Link>
              <Link to="/account/wishlist" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 dark:hover:bg-gray-700 text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-gray-100 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <Link to="/account/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 dark:hover:bg-gray-700 text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
          <main className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone-600 dark:text-gray-400">Full Name</label>
                  <p className="text-lg text-stone-900 dark:text-gray-100">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-stone-600 dark:text-gray-400">Email</label>
                  <p className="text-lg text-stone-900 dark:text-gray-100">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-stone-600 dark:text-gray-400">Phone</label>
                  <p className="text-lg text-stone-900 dark:text-gray-100">{profile?.phone || 'Not set'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100">Recent Orders</h2>
                <Link to="/account/orders" className="text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-gray-100">View All</Link>
              </div>
              {orders.length === 0 ? (
                <p className="text-stone-600 dark:text-gray-400 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-stone-200 dark:border-gray-700 rounded-lg hover:border-stone-400 dark:hover:border-gray-600 transition-colors">
                      <div>
                        <p className="font-medium text-stone-900 dark:text-gray-100">{order.order_number}</p>
                        <p className="text-sm text-stone-600 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-stone-900 dark:text-gray-100">?{order.total_amount}</p>
                        <p className="text-sm text-stone-600 dark:text-gray-400 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-stone-900 dark:text-gray-100">Wishlist</h2>
                <Link to="/account/wishlist" className="text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-gray-100">View All</Link>
              </div>
              {wishlist.length === 0 ? (
                <p className="text-stone-600 dark:text-gray-400 text-center py-8">No items in wishlist</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wishlist.slice(0, 4).map((item) => (
                    <Link key={item.id} to={`/product/${item.product_id}`} className="group">
                      <img src={item.product?.image_url} alt={item.product?.name} className="w-full aspect-square object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity" />
                      <p className="text-sm text-stone-900 dark:text-gray-100 line-clamp-1">{item.product?.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

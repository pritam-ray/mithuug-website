import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Order, Wishlist } from '../types/database';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';

const AccountPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
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
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('wishlists')
          .select('*, product:products(*)')
          .eq('user_id', user.id),
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
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-stone-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-2">
            My Account
          </h1>
          <p className="text-stone-600">Welcome back, {profile?.full_name || 'there'}!</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
              <Link
                to="/account"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-stone-100 text-stone-900"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                to="/account/orders"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </Link>
              <Link
                to="/account/wishlist"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <Link
                to="/account/settings"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-light text-stone-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-stone-600">Full Name</label>
                  <p className="text-lg text-stone-900">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-stone-600">Email</label>
                  <p className="text-lg text-stone-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-stone-600">Phone</label>
                  <p className="text-lg text-stone-900">{profile?.phone || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-stone-900">Recent Orders</h2>
                <Link to="/account/orders" className="text-stone-600 hover:text-stone-900">
                  View All
                </Link>
              </div>

              {orders.length === 0 ? (
                <p className="text-stone-600 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:border-stone-400 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-stone-900">{order.order_number}</p>
                        <p className="text-sm text-stone-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-stone-900">₹{order.total_amount}</p>
                        <p className="text-sm text-stone-600 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-stone-900">Wishlist</h2>
                <Link to="/account/wishlist" className="text-stone-600 hover:text-stone-900">
                  View All
                </Link>
              </div>

              {wishlist.length === 0 ? (
                <p className="text-stone-600 text-center py-8">No items in wishlist</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wishlist.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.product_id}`}
                      className="group"
                    >
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="w-full aspect-square object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity"
                      />
                      <p className="text-sm text-stone-900 line-clamp-1">
                        {item.product?.name}
                      </p>
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

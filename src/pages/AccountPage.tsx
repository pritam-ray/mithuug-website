import React, { useEffect, useState } from 'react';import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';import { useAuth } from '../context/AuthContext';

import { import { supabase } from '../lib/supabase';

  User, Package, Heart, Settings, LogOut, MapPin, import { Order, Wishlist } from '../types/database';

  ShoppingBag, Mail, Phone, Calendar, Sparkles,import { User, Package, Heart, Settings, LogOut } from 'lucide-react';

  ChevronRight, Edit, Trash2, Star

} from 'lucide-react';const AccountPage: React.FC = () => {

  const { user, profile, signOut } = useAuth();

const AccountPage: React.FC = () => {  const navigate = useNavigate();

  const { user, profile, signOut } = useAuth();  const [orders, setOrders] = useState<Order[]>([]);

  const navigate = useNavigate();  const [wishlist, setWishlist] = useState<Wishlist[]>([]);

  const [activeTab, setActiveTab] = useState('overview');  const [loading, setLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

  useEffect(() => {    if (!user) {

    if (!user) {      navigate('/login');

      navigate('/login');      return;

      return;    }

    }    loadData();

  }, [user, navigate]);  }, [user, navigate]);



  const handleSignOut = async () => {  const loadData = async () => {

    await signOut();    if (!user) return;

    navigate('/');

  };    try {

      const [ordersRes, wishlistRes] = await Promise.all([

  // Mock data for demonstration        supabase

  const mockOrders = [          .from('orders')

    {          .select('*')

      id: 1,          .eq('user_id', user.id)

      order_number: 'MG-1730345678',          .order('created_at', { ascending: false })

      created_at: '2025-10-25',          .limit(5),

      total: 799,        supabase

      status: 'delivered',          .from('wishlists')

      items: [          .select('*, product:products(*)')

        { name: 'Classic Til-Gud Bites', quantity: 2, price: 349 }          .eq('user_id', user.id),

      ]      ]);

    },

    {      if (ordersRes.data) setOrders(ordersRes.data);

      id: 2,      if (wishlistRes.data) setWishlist(wishlistRes.data);

      order_number: 'MG-1730245678',    } catch (error) {

      created_at: '2025-10-20',      console.error('Error loading data:', error);

      total: 499,    } finally {

      status: 'shipped',      setLoading(false);

      items: [    }

        { name: 'Cardamom Til-Gud Bites', quantity: 1, price: 399 }  };

      ]

    },  const handleSignOut = async () => {

    {    await signOut();

      id: 3,    navigate('/');

      order_number: 'MG-1730145678',  };

      created_at: '2025-10-15',

      total: 99,  if (loading) {

      status: 'processing',    return (

      items: [      <div className="min-h-screen pt-20 flex items-center justify-center">

        { name: 'Trial Pack', quantity: 1, price: 99 }        <div className="text-stone-600">Loading...</div>

      ]      </div>

    }    );

  ];  }



  const mockAddresses = [  return (

    {    <div className="min-h-screen pt-20 bg-stone-50">

      id: 1,      <div className="max-w-7xl mx-auto px-4 py-12">

      label: 'Home',        <div className="mb-8">

      name: 'Rajesh Kumar',          <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-2">

      address: '123, MG Road, Near Fountain Circle',            My Account

      city: 'Mumbai',          </h1>

      state: 'Maharashtra',          <p className="text-stone-600">Welcome back, {profile?.full_name || 'there'}!</p>

      postal_code: '400001',        </div>

      phone: '+91 98765 43210',

      is_default: true        <div className="grid lg:grid-cols-4 gap-8">

    },          <aside className="lg:col-span-1">

    {            <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">

      id: 2,              <Link

      label: 'Office',                to="/account"

      name: 'Rajesh Kumar',                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-stone-100 text-stone-900"

      address: '456, Business Park, Tech Hub',              >

      city: 'Bengaluru',                <User className="w-5 h-5" />

      state: 'Karnataka',                <span>Profile</span>

      postal_code: '560001',              </Link>

      phone: '+91 98765 43210',              <Link

      is_default: false                to="/account/orders"

    }                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"

  ];              >

                <Package className="w-5 h-5" />

  const getStatusColor = (status: string) => {                <span>Orders</span>

    switch (status) {              </Link>

      case 'delivered':              <Link

        return 'bg-olive-100 text-olive-700 border-olive-300';                to="/account/wishlist"

      case 'shipped':                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"

        return 'bg-ochre-100 text-ochre-700 border-ochre-300';              >

      case 'processing':                <Heart className="w-5 h-5" />

        return 'bg-gold-100 text-gold-700 border-gold-300';                <span>Wishlist</span>

      default:              </Link>

        return 'bg-chocolate-100 text-chocolate-700 border-chocolate-300';              <Link

    }                to="/account/settings"

  };                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"

              >

  if (loading) {                <Settings className="w-5 h-5" />

    return (                <span>Settings</span>

      <div className="min-h-screen bg-ivory-50 flex items-center justify-center">              </Link>

        <div className="text-center">              <button

          <div className="animate-spin w-12 h-12 border-4 border-ochre-500 border-t-transparent rounded-full mx-auto mb-4"></div>                onClick={handleSignOut}

          <p className="text-chocolate-600">Loading your account...</p>                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"

        </div>              >

      </div>                <LogOut className="w-5 h-5" />

    );                <span>Sign Out</span>

  }              </button>

            </div>

  return (          </aside>

    <div className="min-h-screen bg-ivory-50 py-12">

      <div className="max-w-7xl mx-auto px-4">          <main className="lg:col-span-3 space-y-8">

        {/* Header */}            <div className="bg-white rounded-lg shadow-sm p-8">

        <div className="bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-3xl p-8 mb-8 text-white shadow-xl">              <h2 className="text-2xl font-light text-stone-900 mb-6">Profile Information</h2>

          <div className="flex items-center justify-between">              <div className="space-y-4">

            <div className="flex items-center space-x-4">                <div>

              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">                  <label className="text-sm text-stone-600">Full Name</label>

                <User className="w-8 h-8 text-ochre-600" />                  <p className="text-lg text-stone-900">{profile?.full_name || 'Not set'}</p>

              </div>                </div>

              <div>                <div>

                <h1 className="text-3xl font-playfair font-bold mb-1">                  <label className="text-sm text-stone-600">Email</label>

                  Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Friend'}!                  <p className="text-lg text-stone-900">{user?.email}</p>

                </h1>                </div>

                <p className="text-ochre-100 flex items-center space-x-2">                <div>

                  <Sparkles className="w-4 h-4" />                  <label className="text-sm text-stone-600">Phone</label>

                  <span>Your GUD vibes dashboard</span>                  <p className="text-lg text-stone-900">{profile?.phone || 'Not set'}</p>

                </p>                </div>

              </div>              </div>

            </div>            </div>

            <button

              onClick={handleSignOut}            <div className="bg-white rounded-lg shadow-sm p-8">

              className="hidden md:flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full transition-all"              <div className="flex items-center justify-between mb-6">

            >                <h2 className="text-2xl font-light text-stone-900">Recent Orders</h2>

              <LogOut className="w-5 h-5" />                <Link to="/account/orders" className="text-stone-600 hover:text-stone-900">

              <span className="font-medium">Sign Out</span>                  View All

            </button>                </Link>

          </div>              </div>

        </div>

              {orders.length === 0 ? (

        {/* Tabs */}                <p className="text-stone-600 text-center py-8">No orders yet</p>

        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border-2 border-ochre-100">              ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">                <div className="space-y-4">

            <button                  {orders.map((order) => (

              onClick={() => setActiveTab('overview')}                    <div

              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${                      key={order.id}

                activeTab === 'overview'                      className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:border-stone-400 transition-colors"

                  ? 'bg-gradient-to-r from-ochre-500 to-ochre-600 text-white shadow-lg'                    >

                  : 'text-chocolate-700 hover:bg-ochre-50'                      <div>

              }`}                        <p className="font-medium text-stone-900">{order.order_number}</p>

            >                        <p className="text-sm text-stone-600">

              <ShoppingBag className="w-5 h-5" />                          {new Date(order.created_at).toLocaleDateString()}

              <span>Overview</span>                        </p>

            </button>                      </div>

            <button                      <div className="text-right">

              onClick={() => setActiveTab('orders')}                        <p className="font-medium text-stone-900">₹{order.total_amount}</p>

              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${                        <p className="text-sm text-stone-600 capitalize">{order.status}</p>

                activeTab === 'orders'                      </div>

                  ? 'bg-gradient-to-r from-ochre-500 to-ochre-600 text-white shadow-lg'                    </div>

                  : 'text-chocolate-700 hover:bg-ochre-50'                  ))}

              }`}                </div>

            >              )}

              <Package className="w-5 h-5" />            </div>

              <span>Orders</span>

            </button>            <div className="bg-white rounded-lg shadow-sm p-8">

            <button              <div className="flex items-center justify-between mb-6">

              onClick={() => setActiveTab('addresses')}                <h2 className="text-2xl font-light text-stone-900">Wishlist</h2>

              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${                <Link to="/account/wishlist" className="text-stone-600 hover:text-stone-900">

                activeTab === 'addresses'                  View All

                  ? 'bg-gradient-to-r from-ochre-500 to-ochre-600 text-white shadow-lg'                </Link>

                  : 'text-chocolate-700 hover:bg-ochre-50'              </div>

              }`}

            >              {wishlist.length === 0 ? (

              <MapPin className="w-5 h-5" />                <p className="text-stone-600 text-center py-8">No items in wishlist</p>

              <span>Addresses</span>              ) : (

            </button>                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <button                  {wishlist.slice(0, 4).map((item) => (

              onClick={() => setActiveTab('profile')}                    <Link

              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${                      key={item.id}

                activeTab === 'profile'                      to={`/product/${item.product_id}`}

                  ? 'bg-gradient-to-r from-ochre-500 to-ochre-600 text-white shadow-lg'                      className="group"

                  : 'text-chocolate-700 hover:bg-ochre-50'                    >

              }`}                      <img

            >                        src={item.product?.image_url}

              <Settings className="w-5 h-5" />                        alt={item.product?.name}

              <span>Profile</span>                        className="w-full aspect-square object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity"

            </button>                      />

          </div>                      <p className="text-sm text-stone-900 line-clamp-1">

        </div>                        {item.product?.name}

                      </p>

        {/* Content */}                    </Link>

        {activeTab === 'overview' && (                  ))}

          <div className="space-y-6">                </div>

            {/* Stats Cards */}              )}

            <div className="grid md:grid-cols-3 gap-6">            </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-ochre-100 shadow-lg">          </main>

                <div className="flex items-center justify-between mb-4">        </div>

                  <div className="w-12 h-12 bg-ochre-100 rounded-full flex items-center justify-center">      </div>

                    <Package className="w-6 h-6 text-ochre-600" />    </div>

                  </div>  );

                  <span className="text-3xl font-playfair font-bold text-ochre-600">};

                    {mockOrders.length}

                  </span>export default AccountPage;

                </div>
                <h3 className="font-bold text-chocolate-900">Total Orders</h3>
                <p className="text-sm text-chocolate-600">Lifetime purchases</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-olive-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-olive-600" />
                  </div>
                  <span className="text-3xl font-playfair font-bold text-olive-600">
                    150
                  </span>
                </div>
                <h3 className="font-bold text-chocolate-900">Reward Points</h3>
                <p className="text-sm text-chocolate-600">Use on next order</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gold-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-gold-600" />
                  </div>
                  <span className="text-3xl font-playfair font-bold text-gold-600">
                    0
                  </span>
                </div>
                <h3 className="font-bold text-chocolate-900">Wishlist Items</h3>
                <p className="text-sm text-chocolate-600">Saved products</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-8 border-2 border-ochre-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-playfair font-bold text-chocolate-900">
                  Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-ochre-600 hover:text-ochre-700 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {mockOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="border-2 border-ochre-100 rounded-xl p-6 hover:border-ochre-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-chocolate-900">
                          Order #{order.order_number}
                        </p>
                        <p className="text-sm text-chocolate-600 flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-chocolate-700">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                      <p className="text-xl font-playfair font-bold text-ochre-600">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-8 border-2 border-ochre-100 shadow-lg">
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-6">
              Order History
            </h2>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-ochre-100 rounded-xl p-6 hover:border-ochre-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-chocolate-900 text-lg mb-1">
                        Order #{order.order_number}
                      </p>
                      <p className="text-sm text-chocolate-600 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="bg-ochre-50 rounded-lg p-4 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <p className="text-chocolate-700">
                          <span className="font-bold">{item.quantity}x</span> {item.name}
                        </p>
                        <p className="font-bold text-ochre-600">₹{item.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-ochre-100">
                    <p className="text-lg font-bold text-chocolate-900">Total Amount</p>
                    <p className="text-2xl font-playfair font-bold text-ochre-600">₹{order.total}</p>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 bg-gradient-to-r from-ochre-500 to-ochre-600 text-white py-3 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold">
                      Track Order
                    </button>
                    <button className="flex-1 border-2 border-ochre-300 text-ochre-700 py-3 rounded-full hover:bg-ochre-50 transition-all font-bold">
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border-2 border-ochre-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-playfair font-bold text-chocolate-900">
                  Saved Addresses
                </h2>
                <button className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-6 py-3 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold">
                  + Add New Address
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border-2 rounded-2xl p-6 ${
                      address.is_default
                        ? 'border-ochre-400 bg-ochre-50'
                        : 'border-ochre-100 hover:border-ochre-300'
                    } transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-ochre-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-ochre-600" />
                        </div>
                        <div>
                          <p className="font-bold text-chocolate-900">{address.label}</p>
                          {address.is_default && (
                            <span className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-ochre-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-ochre-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-chocolate-700">
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm">{address.address}</p>
                      <p className="text-sm">
                        {address.city}, {address.state} - {address.postal_code}
                      </p>
                      <p className="text-sm flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{address.phone}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-8 border-2 border-ochre-100 shadow-lg">
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-6">
              Profile Settings
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={profile?.full_name || ''}
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl bg-ochre-50 text-chocolate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={profile?.phone || ''}
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t-2 border-ochre-100">
                <h3 className="text-lg font-bold text-chocolate-900 mb-4">
                  Change Password
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-chocolate-900 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-chocolate-900 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-chocolate-900 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="border-2 border-ochre-300 text-ochre-700 px-8 py-4 rounded-full hover:bg-ochre-50 transition-all font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t-2 border-red-100">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-bold"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;

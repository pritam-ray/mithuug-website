import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface DashboardStats {
  total_orders: number;
  orders_last_30_days: number;
  pending_orders: number;
  shipped_orders: number;
  total_revenue: number;
  revenue_last_30_days: number;
  total_products: number;
  low_stock_products: number;
  total_customers: number;
  new_customers_last_30_days: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_profiles: {
    full_name: string;
  };
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      // Load dashboard stats
      const { data: statsData, error: statsError } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();

      if (statsError) throw statsError;
      setStats(statsData);

      // Load recent orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          user_profiles!inner (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;
      setRecentOrders((ordersData as any) || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.total_revenue?.toLocaleString() || 0}`,
      change: `₹${stats?.revenue_last_30_days?.toLocaleString() || 0} this month`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      change: `${stats?.orders_last_30_days || 0} this month`,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      change: `${stats?.low_stock_products || 0} low stock`,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Customers',
      value: stats?.total_customers || 0,
      change: `${stats?.new_customers_last_30_days || 0} new this month`,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  const quickStats = [
    { label: 'Pending Orders', value: stats?.pending_orders || 0, color: 'text-yellow-600' },
    { label: 'Shipped Orders', value: stats?.shipped_orders || 0, color: 'text-blue-600' },
    { label: 'Low Stock Items', value: stats?.low_stock_products || 0, color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-chocolate-900 mb-2">Admin Dashboard</h1>
          <p className="text-chocolate-600">Welcome back! Here's what's happening with MitthuuG.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-chocolate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                {stat.label === 'Low Stock Items' && stat.value > 0 && (
                  <AlertTriangle className="text-red-500" size={32} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-chocolate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="flex flex-col items-center justify-center p-4 border-2 border-ochre-200 rounded-lg hover:bg-ochre-50 transition-colors"
            >
              <Package className="text-ochre mb-2" size={32} />
              <span className="text-sm font-medium text-chocolate-900">Manage Products</span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex flex-col items-center justify-center p-4 border-2 border-ochre-200 rounded-lg hover:bg-ochre-50 transition-colors"
            >
              <ShoppingCart className="text-ochre mb-2" size={32} />
              <span className="text-sm font-medium text-chocolate-900">View Orders</span>
            </button>
            <button
              onClick={() => navigate('/admin/customers')}
              className="flex flex-col items-center justify-center p-4 border-2 border-ochre-200 rounded-lg hover:bg-ochre-50 transition-colors"
            >
              <Users className="text-ochre mb-2" size={32} />
              <span className="text-sm font-medium text-chocolate-900">Customers</span>
            </button>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="flex flex-col items-center justify-center p-4 bg-ochre text-white rounded-lg hover:bg-ochre-600 transition-colors"
            >
              <Package className="mb-2" size={32} />
              <span className="text-sm font-medium">Add Product</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-chocolate-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-ochre hover:text-ochre-600 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order #</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-chocolate-900">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.user_profiles?.full_name || 'Guest'}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      ₹{order.total_amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'confirmed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

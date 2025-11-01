import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar,
  Download,
  Package,
  Star
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

const AdminAnalyticsPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    topProducts: [],
    revenueByDay: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [exporting, setExporting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate = new Date(2020, 0, 1); // All time
      }

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'paid')
        .gte('created_at', startDate.toISOString());

      if (ordersError) throw ordersError;

      // Fetch order items for top products
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, product_name, quantity, price');

      if (itemsError) throw itemsError;

      // Calculate total revenue
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;

      // Get unique customers
      const uniqueCustomers = new Set(orders?.map(order => order.user_id) || []);
      const totalCustomers = uniqueCustomers.size;

      // Calculate average order value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth (comparing to previous period)
      const previousPeriodStart = new Date(startDate);
      const periodLength = now.getTime() - startDate.getTime();
      previousPeriodStart.setTime(startDate.getTime() - periodLength);

      const { data: previousOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', startDate.toISOString());

      const previousRevenue = previousOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const previousOrdersCount = previousOrders?.length || 0;

      const revenueGrowth = previousRevenue > 0 
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      const ordersGrowth = previousOrdersCount > 0 
        ? ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100 
        : 0;

      // Calculate top products
      const productSales = new Map<string, { name: string; sales: number; revenue: number }>();
      
      orderItems?.forEach(item => {
        const existing = productSales.get(item.product_id) || { 
          name: item.product_name, 
          sales: 0, 
          revenue: 0 
        };
        existing.sales += item.quantity;
        existing.revenue += item.price * item.quantity;
        productSales.set(item.product_id, existing);
      });

      const topProducts = Array.from(productSales.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate revenue by day (last 30 days)
      const revenueByDay: Array<{ date: string; revenue: number; orders: number }> = [];
      const last30Days = new Date();
      last30Days.setDate(now.getDate() - 30);

      for (let i = 0; i < 30; i++) {
        const date = new Date(last30Days);
        date.setDate(last30Days.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const dayOrders = orders?.filter(order => 
          order.created_at.startsWith(dateStr)
        ) || [];

        revenueByDay.push({
          date: dateStr,
          revenue: dayOrders.reduce((sum, order) => sum + order.total_amount, 0),
          orders: dayOrders.length
        });
      }

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        topProducts,
        revenueByDay
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      alert('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      setExporting(true);

      // Generate CSV report
      const csvContent = [
        // Header
        ['MitthuuG Analytics Report'],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [`Period: ${timeRange}`],
        [],
        ['Metric', 'Value'],
        ['Total Revenue', `₹${analytics.totalRevenue.toFixed(2)}`],
        ['Total Orders', analytics.totalOrders.toString()],
        ['Total Customers', analytics.totalCustomers.toString()],
        ['Average Order Value', `₹${analytics.averageOrderValue.toFixed(2)}`],
        ['Revenue Growth', `${analytics.revenueGrowth.toFixed(2)}%`],
        ['Orders Growth', `${analytics.ordersGrowth.toFixed(2)}%`],
        [],
        ['Top Products'],
        ['Product', 'Sales', 'Revenue'],
        ...analytics.topProducts.map(p => [p.name, p.sales.toString(), `₹${p.revenue.toFixed(2)}`])
      ].map(row => row.join(',')).join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Log export
      await supabase.rpc('log_admin_activity', {
        p_action: 'export_analytics_report',
        p_details: { timeRange }
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-chocolate-900 mb-2">Analytics & Reports</h1>
          <p className="text-chocolate-600">Track your store performance and sales trends</p>
        </div>
        <div className="flex gap-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          
          {/* Export Button */}
          <button
            onClick={exportReport}
            disabled={exporting}
            className="flex items-center gap-2 bg-ochre text-white px-6 py-2 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50"
          >
            <Download size={20} />
            {exporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className={`text-sm font-semibold ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(analytics.revenueGrowth)}
            </span>
          </div>
          <h3 className="text-chocolate-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-chocolate-900 mt-2">
            {formatCurrency(analytics.totalRevenue)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <span className={`text-sm font-semibold ${analytics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(analytics.ordersGrowth)}
            </span>
          </div>
          <h3 className="text-chocolate-600 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-chocolate-900 mt-2">
            {analytics.totalOrders}
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <h3 className="text-chocolate-600 text-sm font-medium">Total Customers</h3>
          <p className="text-3xl font-bold text-chocolate-900 mt-2">
            {analytics.totalCustomers}
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
          <h3 className="text-chocolate-600 text-sm font-medium">Avg. Order Value</h3>
          <p className="text-3xl font-bold text-chocolate-900 mt-2">
            {formatCurrency(analytics.averageOrderValue)}
          </p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart (Simple Bar Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-chocolate-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Revenue Trend (Last 30 Days)
          </h2>
          <div className="space-y-2">
            {analytics.revenueByDay.slice(-10).map((day, index) => {
              const maxRevenue = Math.max(...analytics.revenueByDay.map(d => d.revenue));
              const barWidth = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-chocolate-600 w-16">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-chocolate-100 rounded-full h-8 relative">
                    <div 
                      className="bg-ochre h-8 rounded-full flex items-center justify-end px-2"
                      style={{ width: `${barWidth}%` }}
                    >
                      {day.revenue > 0 && (
                        <span className="text-xs font-semibold text-white">
                          ₹{day.revenue.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-chocolate-600 w-12">
                    {day.orders} orders
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-chocolate-900 mb-4 flex items-center gap-2">
            <Star size={20} />
            Top Products
          </h2>
          <div className="space-y-4">
            {analytics.topProducts.length === 0 ? (
              <p className="text-chocolate-500 text-center py-8">No sales data available</p>
            ) : (
              analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-chocolate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-ochre text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-chocolate-900">{product.name}</p>
                      <p className="text-sm text-chocolate-600">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-chocolate-900">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-chocolate-900 mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Package className="text-blue-600 mb-2" size={24} />
            <p className="text-sm text-chocolate-600">Conversion Rate</p>
            <p className="text-2xl font-bold text-chocolate-900">
              {analytics.totalCustomers > 0 
                ? ((analytics.totalOrders / analytics.totalCustomers) * 100).toFixed(1) 
                : '0'}%
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <ShoppingBag className="text-green-600 mb-2" size={24} />
            <p className="text-sm text-chocolate-600">Orders per Customer</p>
            <p className="text-2xl font-bold text-chocolate-900">
              {analytics.totalCustomers > 0 
                ? (analytics.totalOrders / analytics.totalCustomers).toFixed(1) 
                : '0'}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <DollarSign className="text-purple-600 mb-2" size={24} />
            <p className="text-sm text-chocolate-600">Customer Lifetime Value</p>
            <p className="text-2xl font-bold text-chocolate-900">
              {formatCurrency(analytics.totalCustomers > 0 
                ? analytics.totalRevenue / analytics.totalCustomers 
                : 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { Package, Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  payment_status: string;
  payment_id: string;
  shipping_address: any;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer_name?: string;
  customer_email?: string;
}

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with user profiles
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles!orders_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return {
            ...order,
            items: itemsData || [],
            customer_name: order.user_profiles?.full_name || 'Unknown',
            customer_email: order.user_profiles?.email || ''
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);

      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // If marking as shipped, require tracking number
      if (newStatus === 'shipped' && !trackingNumber.trim()) {
        alert('Please enter a tracking number');
        return;
      }

      if (newStatus === 'shipped' && trackingNumber.trim()) {
        updateData.tracking_number = trackingNumber.trim();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'update_order_status',
        p_details: { order_id: orderId, new_status: newStatus }
      });

      alert('Order status updated successfully');
      setTrackingNumber('');
      setShowDetailsModal(false);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <Package size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      case 'refunded':
        return <RefreshCw size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
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
          <h1 className="text-3xl font-bold text-chocolate-900 mb-2">Orders Management</h1>
          <p className="text-chocolate-600">View and manage all customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chocolate-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chocolate-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-chocolate-200">
            <thead className="bg-chocolate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-chocolate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-chocolate-500">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No orders found matching your filters'
                      : 'No orders yet'
                    }
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-chocolate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-chocolate-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-chocolate-900">{order.customer_name}</div>
                        <div className="text-sm text-chocolate-500">{order.customer_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-chocolate-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-chocolate-900">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        order.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingNumber(order.tracking_number || '');
                          setShowDetailsModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-ochre hover:text-ochre-600 font-medium"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-chocolate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-chocolate-900">
                    Order {selectedOrder.order_number}
                  </h2>
                  <p className="text-chocolate-600 mt-1">
                    Placed on {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-chocolate-400 hover:text-chocolate-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-chocolate-900 mb-2">Customer Information</h3>
                <div className="bg-chocolate-50 rounded-lg p-4">
                  <p className="text-chocolate-900 font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-chocolate-600">{selectedOrder.customer_email}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-chocolate-900 mb-2">Shipping Address</h3>
                <div className="bg-chocolate-50 rounded-lg p-4">
                  {selectedOrder.shipping_address ? (
                    <>
                      <p className="text-chocolate-900">{selectedOrder.shipping_address.street}</p>
                      <p className="text-chocolate-900">
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                      </p>
                      <p className="text-chocolate-900">{selectedOrder.shipping_address.country}</p>
                      <p className="text-chocolate-600 mt-2">Phone: {selectedOrder.shipping_address.phone}</p>
                    </>
                  ) : (
                    <p className="text-chocolate-500">No shipping address provided</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-chocolate-900 mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-chocolate-50 rounded-lg p-4">
                      <img
                        src={item.image_url || '/placeholder.jpg'}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-chocolate-900">{item.product_name}</p>
                        <p className="text-sm text-chocolate-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-chocolate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-chocolate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-chocolate-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-chocolate-900">
                      {formatCurrency(selectedOrder.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-semibold text-chocolate-900 mb-3">Update Order Status</h3>
                <div className="space-y-3">
                  {/* Current Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-chocolate-600">Current Status:</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>

                  {/* Tracking Number (if shipped) */}
                  {selectedOrder.tracking_number && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-sm text-purple-900">
                        <span className="font-semibold">Tracking Number:</span> {selectedOrder.tracking_number}
                      </p>
                    </div>
                  )}

                  {/* Status Update Actions */}
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                          disabled={updatingStatus}
                          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          <CheckCircle size={18} />
                          Confirm Order
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                          disabled={updatingStatus}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          <XCircle size={18} />
                          Cancel Order
                        </button>
                      </>
                    )}

                    {selectedOrder.status === 'confirmed' && (
                      <div className="w-full space-y-2">
                        <input
                          type="text"
                          placeholder="Enter tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full px-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
                        />
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                          disabled={updatingStatus || !trackingNumber.trim()}
                          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                        >
                          <Truck size={18} />
                          Mark as Shipped
                        </button>
                      </div>
                    )}

                    {selectedOrder.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                        disabled={updatingStatus}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                      >
                        <Package size={18} />
                        Mark as Delivered
                      </button>
                    )}

                    {(selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled') && (
                      <button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'refunded')}
                        disabled={updatingStatus}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                      >
                        <RefreshCw size={18} />
                        Mark as Refunded
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

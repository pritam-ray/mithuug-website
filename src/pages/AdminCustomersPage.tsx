import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { Users, Search, Mail, Calendar, DollarSign, ShoppingBag, Shield, UserCheck, Eye, X } from 'lucide-react';

interface CustomerOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Customer {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin' | 'super_admin';
  created_at: string;
  total_spent: number;
  order_count: number;
  last_order_date?: string;
  orders?: CustomerOrder[];
}

const AdminCustomersPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, isLoading: adminLoading } = useAdmin();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  // Load customers
  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter customers
  useEffect(() => {
    let filtered = [...customers];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(customer =>
        customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchQuery]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch all user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Calculate stats for each customer
      const customersWithStats = await Promise.all(
        (profilesData || []).map(async (profile) => {
          // Get order stats
          const { data: ordersData } = await supabase
            .from('orders')
            .select('id, total_amount, created_at')
            .eq('user_id', profile.id)
            .eq('payment_status', 'paid');

          const totalSpent = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
          const orderCount = ordersData?.length || 0;
          const lastOrder = ordersData && ordersData.length > 0 
            ? ordersData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
            : null;

          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || 'Unknown',
            role: profile.role || 'customer',
            created_at: profile.created_at,
            total_spent: totalSpent,
            order_count: orderCount,
            last_order_date: lastOrder?.created_at
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Error loading customers:', error);
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerOrders = async (customerId: string) => {
    try {
      setLoadingOrders(true);
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, created_at')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (selectedCustomer) {
        setSelectedCustomer({
          ...selectedCustomer,
          orders: ordersData || []
        });
      }
    } catch (error) {
      console.error('Error loading customer orders:', error);
      alert('Failed to load customer orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateCustomerRole = async (customerId: string, newRole: 'customer' | 'admin') => {
    if (!isSuperAdmin) {
      alert('Only super admins can change user roles');
      return;
    }

    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingRole(true);

      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', customerId);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'change_user_role',
        p_details: { user_id: customerId, new_role: newRole }
      });

      alert('User role updated successfully');
      setShowDetailsModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    } finally {
      setUpdatingRole(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'super_admin' || role === 'admin') {
      return <Shield size={14} />;
    }
    return <UserCheck size={14} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-chocolate-900 mb-2">Customers Management</h1>
          <p className="text-chocolate-600">View and manage customer accounts</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-chocolate-600 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-chocolate-900 mt-2">{customers.length}</p>
            </div>
            <Users className="text-ochre" size={40} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-chocolate-600 text-sm font-medium">Active Customers</p>
              <p className="text-3xl font-bold text-chocolate-900 mt-2">
                {customers.filter(c => c.order_count > 0).length}
              </p>
            </div>
            <ShoppingBag className="text-ochre" size={40} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-chocolate-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-chocolate-900 mt-2">
                {formatCurrency(customers.reduce((sum, c) => sum + c.total_spent, 0))}
              </p>
            </div>
            <DollarSign className="text-ochre" size={40} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-chocolate-600 text-sm font-medium">Avg. Order Value</p>
              <p className="text-3xl font-bold text-chocolate-900 mt-2">
                {formatCurrency(
                  customers.reduce((sum, c) => sum + c.total_spent, 0) / 
                  Math.max(1, customers.reduce((sum, c) => sum + c.order_count, 0))
                )}
              </p>
            </div>
            <DollarSign className="text-ochre" size={40} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chocolate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-chocolate-300 rounded-lg focus:ring-2 focus:ring-ochre focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-chocolate-200">
            <thead className="bg-chocolate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chocolate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-chocolate-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-chocolate-500">
                    {searchQuery 
                      ? 'No customers found matching your search'
                      : 'No customers yet'
                    }
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-chocolate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-chocolate-900">{customer.full_name}</div>
                        <div className="text-sm text-chocolate-500 flex items-center gap-1">
                          <Mail size={14} />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(customer.role)}`}>
                        {getRoleIcon(customer.role)}
                        {customer.role === 'super_admin' ? 'Super Admin' : customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-chocolate-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(customer.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-chocolate-900 font-medium">
                        <ShoppingBag size={16} />
                        {customer.order_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-chocolate-900">
                        {formatCurrency(customer.total_spent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-chocolate-600">
                      {customer.last_order_date ? formatDate(customer.last_order_date) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetailsModal(true);
                          loadCustomerOrders(customer.id);
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

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-chocolate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-chocolate-900">
                    {selectedCustomer.full_name}
                  </h2>
                  <p className="text-chocolate-600 mt-1 flex items-center gap-2">
                    <Mail size={16} />
                    {selectedCustomer.email}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-chocolate-400 hover:text-chocolate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-chocolate-50 rounded-lg p-4">
                  <p className="text-chocolate-600 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-chocolate-900 mt-1">
                    {selectedCustomer.order_count}
                  </p>
                </div>
                <div className="bg-chocolate-50 rounded-lg p-4">
                  <p className="text-chocolate-600 text-sm font-medium">Lifetime Value</p>
                  <p className="text-2xl font-bold text-chocolate-900 mt-1">
                    {formatCurrency(selectedCustomer.total_spent)}
                  </p>
                </div>
                <div className="bg-chocolate-50 rounded-lg p-4">
                  <p className="text-chocolate-600 text-sm font-medium">Average Order</p>
                  <p className="text-2xl font-bold text-chocolate-900 mt-1">
                    {formatCurrency(selectedCustomer.order_count > 0 ? selectedCustomer.total_spent / selectedCustomer.order_count : 0)}
                  </p>
                </div>
              </div>

              {/* Role Management (Super Admin Only) */}
              {isSuperAdmin && selectedCustomer.role !== 'super_admin' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-chocolate-900 mb-3">Role Management</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-chocolate-600">Current Role:</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(selectedCustomer.role)}`}>
                      {getRoleIcon(selectedCustomer.role)}
                      {selectedCustomer.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {selectedCustomer.role !== 'admin' && (
                      <button
                        onClick={() => updateCustomerRole(selectedCustomer.id, 'admin')}
                        disabled={updatingRole}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                      >
                        <Shield size={18} />
                        Promote to Admin
                      </button>
                    )}
                    {selectedCustomer.role === 'admin' && (
                      <button
                        onClick={() => updateCustomerRole(selectedCustomer.id, 'customer')}
                        disabled={updatingRole}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                      >
                        <UserCheck size={18} />
                        Demote to Customer
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Order History */}
              <div>
                <h3 className="font-semibold text-chocolate-900 mb-3">Order History</h3>
                {loadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ochre"></div>
                  </div>
                ) : selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="bg-chocolate-50 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-chocolate-900">{order.order_number}</p>
                          <p className="text-sm text-chocolate-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-chocolate-900">{formatCurrency(order.total_amount)}</p>
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-chocolate-500 text-center py-8">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;

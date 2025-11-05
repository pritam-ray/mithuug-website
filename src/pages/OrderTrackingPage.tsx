import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import SEO from '../components/SEO';
import { PageLoader } from '../components/LoadingComponents';

interface Order {
  id: string;
  order_number: string;
  status: string;
  shipping_status: string;
  total_amount: number;
  tracking_number: string;
  shipping_carrier: string;
  shipped_at: string;
  delivered_at: string;
  estimated_delivery_date: string;
  created_at: string;
  shipping_address: any;
}

interface StatusHistory {
  id: string;
  status: string;
  shipping_status: string;
  notes: string;
  created_at: string;
}

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && orderId) {
      loadOrderTracking();
    } else if (!user) {
      navigate('/login');
    }
  }, [user, orderId]);

  const loadOrderTracking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Verify this order belongs to the user
      if (orderData.user_id !== user?.id) {
        setError('Order not found');
        return;
      }

      setOrder(orderData);

      // Load status history
      const { data: historyData, error: historyError } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;
      setStatusHistory(historyData || []);
    } catch (error: any) {
      console.error('Error loading order tracking:', error);
      setError('Failed to load order tracking information');
    } finally {
      setLoading(false);
    }
  };

  const getShippingStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
      pending: {
        label: 'Order Placed',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      processing: {
        label: 'Processing',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      shipped: {
        label: 'Shipped',
        icon: Truck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      in_transit: {
        label: 'In Transit',
        icon: Truck,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        icon: MapPin,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      delivered: {
        label: 'Delivered',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      failed: {
        label: 'Delivery Failed',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      returned: {
        label: 'Returned',
        icon: Package,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      }
    };

    return statusMap[status] || statusMap.pending;
  };

  const getCurrentStep = (status: string): number => {
    const stepOrder = ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
    return stepOrder.indexOf(status) + 1;
  };

  if (loading) {
    return <PageLoader text="Loading order tracking..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-4 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl font-playfair font-bold text-chocolate-900 mb-4">
            {error || 'Order Not Found'}
          </h1>
          <Link
            to="/account/orders"
            className="inline-block bg-ochre text-white px-8 py-3 rounded-lg hover:bg-ochre-600 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusInfo = getShippingStatusInfo(order.shipping_status);
  const CurrentIcon = currentStatusInfo.icon;
  const currentStep = getCurrentStep(order.shipping_status);

  return (
    <div className="min-h-screen pt-4 bg-ivory">
      <SEO 
        title={`Track Order ${order.order_number} - MitthuuG`}
        description="Track your order status and delivery"
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-chocolate-600 hover:text-ochre mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </Link>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-chocolate-900 mb-2">
                Order {order.order_number}
              </h1>
              <p className="text-chocolate-600">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${currentStatusInfo.bgColor}`}>
              <CurrentIcon size={24} className={currentStatusInfo.color} />
              <span className={`font-semibold ${currentStatusInfo.color}`}>
                {currentStatusInfo.label}
              </span>
            </div>
          </div>

          {/* Tracking Info */}
          {order.tracking_number && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-ivory rounded-lg">
              <div>
                <p className="text-sm text-chocolate-600 mb-1">Tracking Number</p>
                <p className="font-semibold text-chocolate-900">{order.tracking_number}</p>
              </div>
              {order.shipping_carrier && (
                <div>
                  <p className="text-sm text-chocolate-600 mb-1">Carrier</p>
                  <p className="font-semibold text-chocolate-900">{order.shipping_carrier}</p>
                </div>
              )}
              {order.estimated_delivery_date && (
                <div>
                  <p className="text-sm text-chocolate-600 mb-1">Estimated Delivery</p>
                  <p className="font-semibold text-chocolate-900">
                    {new Date(order.estimated_delivery_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-8">
            Tracking Timeline
          </h2>

          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-chocolate-200"></div>
            <div 
              className="absolute left-8 top-0 w-0.5 bg-ochre transition-all duration-500"
              style={{ height: `${(currentStep / 6) * 100}%` }}
            ></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].map((status, index) => {
                const statusInfo = getShippingStatusInfo(status);
                const StatusIcon = statusInfo.icon;
                const isCompleted = getCurrentStep(order.shipping_status) > index;
                const isCurrent = getCurrentStep(order.shipping_status) === index + 1;
                const historyEntry = statusHistory.find(h => h.shipping_status === status);

                return (
                  <div key={status} className="relative flex items-start gap-6">
                    {/* Icon */}
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${
                      isCurrent ? statusInfo.bgColor : isCompleted ? 'bg-green-50' : 'bg-gray-100'
                    }`}>
                      <StatusIcon 
                        size={28} 
                        className={isCurrent ? statusInfo.color : isCompleted ? 'text-green-600' : 'text-gray-400'}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <h3 className={`text-lg font-semibold mb-1 ${
                        isCurrent || isCompleted ? 'text-chocolate-900' : 'text-chocolate-400'
                      }`}>
                        {statusInfo.label}
                      </h3>
                      {historyEntry && (
                        <p className="text-sm text-chocolate-600 mb-2">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(historyEntry.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      {historyEntry?.notes && (
                        <p className="text-sm text-chocolate-600">
                          {historyEntry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              Delivery Address
            </h2>
            <div className="text-chocolate-600">
              <p className="font-semibold text-chocolate-900">{order.shipping_address.name}</p>
              <p>{order.shipping_address.line1}</p>
              {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
              <p className="mt-2">Phone: {order.shipping_address.phone}</p>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-chocolate-600 mb-4">
            Need help with your order?
          </p>
          <Link
            to="/contact"
            className="inline-block text-ochre hover:text-ochre-600 font-semibold"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;

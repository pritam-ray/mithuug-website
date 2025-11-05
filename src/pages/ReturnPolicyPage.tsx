import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-4 bg-ivory-50">
      <SEO 
        title="Return & Refund Policy | MitthuuG"
        description="MitthuuG's return and refund policy. 7-day return window, easy refund process, and customer satisfaction guaranteed. Learn about eligible items and return procedures."
        keywords="return policy, refund policy, product returns, money back, customer returns"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-ochre-600 hover:text-ochre-700 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <RefreshCw className="w-10 h-10 text-ochre-600" />
            <h1 className="text-4xl font-playfair font-bold text-chocolate-900">Return & Refund Policy</h1>
          </div>
          <p className="text-chocolate-600">Last Updated: November 1, 2025</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {/* Return Window */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Return Period</h2>
            <div className="p-4 bg-olive-50 border-l-4 border-olive-500">
              <p className="text-chocolate-700 font-bold">
                You can return products within <span className="text-olive-600">7 days</span> of delivery.
              </p>
            </div>
          </section>

          {/* Eligible Returns */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-olive-600" />
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Eligible for Return</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Products with manufacturing defects</li>
              <li>Damaged products received</li>
              <li>Wrong product delivered</li>
              <li>Expired or near-expiry products (within 30 days of expiry)</li>
              <li>Tampered or unsealed packaging</li>
            </ul>
          </section>

          {/* Non-Returnable */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Non-Returnable Items</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Opened or consumed products</li>
              <li>Products without original packaging</li>
              <li>Products purchased during sale/clearance (unless defective)</li>
              <li>Gift packs with broken seals</li>
              <li>Custom or personalized orders</li>
            </ul>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">How to Return</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-ochre-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-chocolate-900">Initiate Return Request</h3>
                  <p className="text-chocolate-700">
                    Log in to your account, go to "My Orders," and click "Return" on the eligible order.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-ochre-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-chocolate-900">Select Reason</h3>
                  <p className="text-chocolate-700">
                    Choose the reason for return and upload photos if the product is damaged.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-ochre-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-chocolate-900">Approval & Pickup</h3>
                  <p className="text-chocolate-700">
                    Once approved, we'll arrange a pickup from your address within 2-3 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-ochre-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-chocolate-900">Quality Check & Refund</h3>
                  <p className="text-chocolate-700">
                    After receiving and inspecting the product, we'll process your refund within 7-10 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Methods */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Refund Process</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-ochre-50 rounded-lg">
                <h3 className="font-bold text-chocolate-900 mb-2">Online Payments</h3>
                <p className="text-sm text-chocolate-700">
                  Refunds will be credited to the original payment method (card/UPI) within 7-10 business days.
                </p>
              </div>
              <div className="p-4 bg-ochre-50 rounded-lg">
                <h3 className="font-bold text-chocolate-900 mb-2">Cash on Delivery</h3>
                <p className="text-sm text-chocolate-700">
                  Refunds will be processed via bank transfer. Please provide your bank account details.
                </p>
              </div>
            </div>
          </section>

          {/* Exchange Policy */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Exchange Policy</h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              We currently do not offer direct exchanges. If you wish to exchange a product:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-chocolate-700">
              <li>Return the original product following our return process</li>
              <li>Once the refund is processed, place a new order for the desired product</li>
            </ol>
          </section>

          {/* Cancellation */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-6 h-6 text-ochre-600" />
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Order Cancellation</h2>
            </div>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              You can cancel your order before it's shipped:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Log in to your account and go to "My Orders"</li>
              <li>Click "Cancel Order" on orders that haven't been shipped</li>
              <li>Refunds for cancelled orders will be processed within 3-5 business days</li>
              <li>Once shipped, you must follow the return process instead</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Need Help?</h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              For any questions about returns or refunds, our customer support team is here to help:
            </p>
            <div className="p-4 bg-ochre-50 rounded-lg">
              <p className="text-chocolate-700">
                <strong>Email:</strong> returns@mitthuug.com<br />
                <strong>Phone:</strong> +91 98765 43210<br />
                <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/privacy" className="text-ochre-600 hover:text-ochre-700 underline">Privacy Policy</Link>
          <Link to="/terms" className="text-ochre-600 hover:text-ochre-700 underline">Terms & Conditions</Link>
          <Link to="/shipping" className="text-ochre-600 hover:text-ochre-700 underline">Shipping Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowLeft, Package, Clock, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-4 bg-ivory-50">
      <SEO 
        title="Shipping Policy | MitthuuG"
        description="Learn about MitthuuG's shipping policy, delivery zones, shipping charges, and estimated delivery times across India. Free shipping on orders above ₹500."
        keywords="shipping policy, delivery charges, shipping times, free shipping, courier delivery"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-ochre-600 hover:text-ochre-700 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Truck className="w-10 h-10 text-ochre-600" />
            <h1 className="text-4xl font-playfair font-bold text-chocolate-900">Shipping Policy</h1>
          </div>
          <p className="text-chocolate-600">Last Updated: November 1, 2025</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          {/* Shipping Zones */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-6 h-6 text-ochre-600" />
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Delivery Zones</h2>
            </div>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              We currently ship to all locations across India through our trusted courier partners.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-ochre-50 rounded-lg">
                <h3 className="font-bold text-chocolate-900 mb-2">Metro Cities</h3>
                <p className="text-sm text-chocolate-700">Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune</p>
                <p className="text-ochre-600 font-bold mt-2">3-5 Business Days</p>
              </div>
              <div className="p-4 bg-ochre-50 rounded-lg">
                <h3 className="font-bold text-chocolate-900 mb-2">Other Cities</h3>
                <p className="text-sm text-chocolate-700">Tier 2 & 3 cities across India</p>
                <p className="text-ochre-600 font-bold mt-2">5-7 Business Days</p>
              </div>
            </div>
          </section>

          {/* Shipping Charges */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-6 h-6 text-ochre-600" />
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Shipping Charges</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ochre-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-chocolate-900">Order Value</th>
                    <th className="px-4 py-3 text-left text-chocolate-900">Shipping Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ochre-100">
                  <tr>
                    <td className="px-4 py-3 text-chocolate-700">Above ₹500</td>
                    <td className="px-4 py-3 text-olive-600 font-bold">FREE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-chocolate-700">₹300 - ₹499</td>
                    <td className="px-4 py-3 text-chocolate-700">₹50</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-chocolate-700">Below ₹300</td>
                    <td className="px-4 py-3 text-chocolate-700">₹80</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-6 h-6 text-ochre-600" />
              <h2 className="text-2xl font-playfair font-bold text-chocolate-900">Order Processing</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Orders are processed within 1-2 business days</li>
              <li>Orders placed on weekends/holidays will be processed on the next business day</li>
              <li>You will receive a tracking number once your order ships</li>
              <li>Track your order status in your account dashboard</li>
            </ul>
          </section>

          {/* Packaging */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Packaging Standards</h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              All our products are carefully packaged to ensure they reach you in perfect condition:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Food-grade, eco-friendly packaging materials</li>
              <li>Tamper-proof seals on all products</li>
              <li>Cushioned packaging to prevent damage during transit</li>
              <li>Temperature-controlled packaging when required</li>
            </ul>
          </section>

          {/* Delivery Issues */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Delivery Issues</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-chocolate-900 mb-2">Damaged or Lost Packages</h3>
                <p className="text-chocolate-700">
                  If your package arrives damaged or doesn't arrive within the estimated timeframe, 
                  please contact us immediately at support@mitthuug.com or +91 98765 43210.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-chocolate-900 mb-2">Incorrect Address</h3>
                <p className="text-chocolate-700">
                  Please ensure your shipping address is correct. We are not responsible for orders 
                  shipped to incorrect addresses provided by the customer.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-chocolate-900 mb-2">Failed Delivery Attempts</h3>
                <p className="text-chocolate-700">
                  If delivery fails multiple times due to unavailability, the package will be returned. 
                  Return shipping charges may apply for re-shipment.
                </p>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">International Shipping</h2>
            <p className="text-chocolate-700 leading-relaxed">
              We currently do not offer international shipping. We only deliver within India. 
              Stay tuned for updates on international delivery options!
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">Shipping Inquiries</h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              For any shipping-related questions, please contact our customer support:
            </p>
            <div className="p-4 bg-ochre-50 rounded-lg">
              <p className="text-chocolate-700">
                <strong>Email:</strong> shipping@mitthuug.com<br />
                <strong>Phone:</strong> +91 98765 43210<br />
                <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/privacy" className="text-ochre-600 hover:text-ochre-700 underline">Privacy Policy</Link>
          <Link to="/terms" className="text-ochre-600 hover:text-ochre-700 underline">Terms & Conditions</Link>
          <Link to="/returns" className="text-ochre-600 hover:text-ochre-700 underline">Return Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;

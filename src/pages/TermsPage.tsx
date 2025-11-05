import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-12 bg-ivory-50">
      <SEO 
        title="Terms & Conditions | MitthuuG"
        description="Read MitthuuG's terms and conditions for using our website, ordering products, shipping policies, and return guidelines."
        keywords="terms and conditions, terms of service, user agreement, mitthuug terms"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-ochre-600 hover:text-ochre-700 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-10 h-10 text-ochre-600" />
            <h1 className="text-4xl font-playfair font-bold text-chocolate-900">Terms & Conditions</h1>
          </div>
          <p className="text-chocolate-600">Last Updated: November 1, 2025</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-chocolate-700 leading-relaxed">
              By accessing and using MitthuuG's website and services, you agree to be bound by these Terms and Conditions. 
              If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">2. Products and Services</h2>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>All products are FSSAI certified and made with natural ingredients</li>
              <li>Product images are for representation purposes only</li>
              <li>We reserve the right to modify product offerings without notice</li>
              <li>Prices are subject to change without prior notification</li>
              <li>All prices are in Indian Rupees (₹) and include applicable taxes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">3. Orders and Payment</h2>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>All orders are subject to acceptance and availability</li>
              <li>We accept online payments via credit/debit cards, UPI, and Cash on Delivery (COD)</li>
              <li>Payment must be received before order processing</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Order confirmation will be sent via email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">4. Shipping and Delivery</h2>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Free shipping on orders above ₹500</li>
              <li>Delivery timeframes are estimates and not guaranteed</li>
              <li>We are not responsible for delays caused by courier services</li>
              <li>Risk of loss passes to you upon delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">5. Returns and Refunds</h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              Please refer to our <Link to="/returns" className="text-ochre-600 hover:text-ochre-700 underline">Return Policy</Link> for detailed information.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Products can be returned within 7 days of delivery</li>
              <li>Items must be unopened and in original packaging</li>
              <li>Refunds will be processed within 7-10 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">6. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>You are responsible for maintaining account confidentiality</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>You must provide accurate and complete information</li>
              <li>One account per person/email address</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">7. Intellectual Property</h2>
            <p className="text-chocolate-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of 
              MitthuuG and protected by copyright laws. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-chocolate-700 leading-relaxed">
              MitthuuG shall not be liable for any indirect, incidental, special, or consequential damages arising 
              from the use of our products or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">9. Governing Law</h2>
            <p className="text-chocolate-700 leading-relaxed">
              These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive 
              jurisdiction of courts in Mumbai, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">10. Contact Information</h2>
            <div className="p-4 bg-ochre-50 rounded-lg">
              <p className="text-chocolate-700">
                <strong>Email:</strong> legal@mitthuug.com<br />
                <strong>Phone:</strong> +91 98765 43210<br />
                <strong>Address:</strong> MitthuuG Foods Pvt. Ltd., Mumbai, India
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/privacy" className="text-ochre-600 hover:text-ochre-700 underline">Privacy Policy</Link>
          <Link to="/shipping" className="text-ochre-600 hover:text-ochre-700 underline">Shipping Policy</Link>
          <Link to="/returns" className="text-ochre-600 hover:text-ochre-700 underline">Return Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

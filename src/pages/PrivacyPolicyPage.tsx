import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 bg-ivory-50">
      <SEO 
        title="Privacy Policy | MitthuuG"
        description="Read MitthuuG's privacy policy to understand how we collect, use, and protect your personal information. Your privacy and data security are our priorities."
        keywords="privacy policy, data protection, user privacy, mitthuug privacy"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-ochre-600 hover:text-ochre-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-10 h-10 text-ochre-600" />
            <h1 className="text-4xl font-playfair font-bold text-chocolate-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-chocolate-600">
            Last Updated: November 1, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-chocolate-700 leading-relaxed">
              At MitthuuG ("we," "our," or "us"), we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-chocolate-700">
              <div>
                <h3 className="font-bold mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Account credentials</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Automatically Collected Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your inquiries and customer service requests</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              4. Information Sharing
            </h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li><strong>Service Providers:</strong> Payment processors, shipping companies, email service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              5. Cookies and Tracking
            </h2>
            <p className="text-chocolate-700 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze website traffic, and personalize content. 
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              6. Data Security
            </h2>
            <p className="text-chocolate-700 leading-relaxed">
              We implement industry-standard security measures to protect your information, including encryption, 
              secure servers, and regular security audits. However, no method of transmission over the internet 
              is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              7. Your Rights
            </h2>
            <p className="text-chocolate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-chocolate-700">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-chocolate-700 leading-relaxed">
              Our services are not intended for children under 13. We do not knowingly collect information 
              from children under 13 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-chocolate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-chocolate-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-ochre-50 rounded-lg">
              <p className="text-chocolate-700">
                <strong>Email:</strong> privacy@mitthuug.com<br />
                <strong>Phone:</strong> +91 98765 43210<br />
                <strong>Address:</strong> MitthuuG Foods Pvt. Ltd., Mumbai, India
              </p>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            to="/terms"
            className="text-ochre-600 hover:text-ochre-700 underline"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/shipping"
            className="text-ochre-600 hover:text-ochre-700 underline"
          >
            Shipping Policy
          </Link>
          <Link
            to="/returns"
            className="text-ochre-600 hover:text-ochre-700 underline"
          >
            Return Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

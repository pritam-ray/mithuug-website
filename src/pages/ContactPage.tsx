import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <SEO 
        title="Contact Us | MitthuuG"
        description="Get in touch with MitthuuG. Contact us for inquiries about our til-gud sweets, bulk orders, or customer support. We're here to help!"
        keywords="contact mitthuug, customer support, contact details, email, phone number, bulk orders"
      />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-chocolate-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-chocolate-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg text-center hover:border-ochre-300 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-chocolate-900 mb-2">
              Email Us
            </h3>
            <p className="text-chocolate-600 mb-4">
              We're here to help!
            </p>
            <a
              href="mailto:hello@mitthuug.com"
              className="text-ochre-600 hover:text-ochre-700 font-bold"
            >
              hello@mitthuug.com
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg text-center hover:border-ochre-300 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-olive-500 to-olive-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-chocolate-900 mb-2">
              Call Us
            </h3>
            <p className="text-chocolate-600 mb-4">
              Mon-Sat, 9AM-6PM IST
            </p>
            <a
              href="tel:+919876543210"
              className="text-ochre-600 hover:text-ochre-700 font-bold"
            >
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg text-center hover:border-ochre-300 transition-all">
            <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-playfair font-bold text-chocolate-900 mb-2">
              Visit Us
            </h3>
            <p className="text-chocolate-600 mb-4">
              Come say hello!
            </p>
            <p className="text-ochre-600 font-bold">
              Mumbai, India
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-ochre-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-ochre-600" />
              </div>
              <h2 className="text-3xl font-playfair font-bold text-chocolate-900">
                Send a Message
              </h2>
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-olive-50 border-2 border-olive-300 rounded-xl">
                <p className="text-olive-700 font-medium flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Thank you! We'll get back to you soon.</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                    placeholder="Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-chocolate-900 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="bulk">Bulk Orders</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-chocolate-900 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-ochre-200 rounded-xl focus:border-ochre-500 focus:outline-none transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-ochre-500 to-ochre-600 text-white py-4 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Business Hours */}
            <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-olive-600" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-chocolate-900">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-ochre-100">
                  <span className="font-medium text-chocolate-700">Monday - Friday</span>
                  <span className="text-ochre-600 font-bold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ochre-100">
                  <span className="font-medium text-chocolate-700">Saturday</span>
                  <span className="text-ochre-600 font-bold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-chocolate-700">Sunday</span>
                  <span className="text-chocolate-400">Closed</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-ochre-500 to-ochre-600 rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-2xl font-playfair font-bold mb-4">
                Follow Our Journey
              </h3>
              <p className="text-ochre-100 mb-6">
                Join our community and stay updated with delicious recipes, health tips, and exclusive offers!
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-white rounded-3xl p-8 border-2 border-ochre-100 shadow-lg">
              <h3 className="text-2xl font-playfair font-bold text-chocolate-900 mb-4">
                Quick Answers
              </h3>
              <p className="text-chocolate-600 mb-6">
                Looking for answers? Check out our FAQ section for instant solutions to common questions.
              </p>
              <a
                href="/about#faq"
                className="inline-block bg-gradient-to-r from-ochre-500 to-ochre-600 text-white px-8 py-3 rounded-full hover:from-ochre-600 hover:to-ochre-700 transition-all font-bold shadow-lg"
              >
                View FAQs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Product Information',
    question: 'What are Til-Gud bites made of?',
    answer: 'Our Til-Gud bites are made with premium roasted sesame seeds and pure jaggery. We use only natural ingredients - no refined sugar, no preservatives, no artificial flavors. Some variants include cardamom, almonds, or other natural ingredients for added flavor.',
  },
  {
    category: 'Product Information',
    question: 'Are your products suitable for diabetics?',
    answer: 'While our products use jaggery instead of refined sugar, they still contain natural sugars and should be consumed in moderation. We recommend consulting with your healthcare provider before including them in a diabetic diet.',
  },
  {
    category: 'Product Information',
    question: 'What is the shelf life of your products?',
    answer: 'Our Til-Gud bites have a shelf life of 3 months when stored in an airtight container in a cool, dry place. We recommend consuming them fresh for the best taste and texture.',
  },
  {
    category: 'Product Information',
    question: 'Do you use any preservatives or artificial ingredients?',
    answer: 'No! We are committed to using only natural, traditional ingredients. Our products are free from preservatives, artificial colors, and artificial flavors. What you see on the label is what you get - pure, honest ingredients.',
  },
  {
    category: 'Ordering & Shipping',
    question: 'What are your shipping charges?',
    answer: 'We offer FREE shipping on all orders above ₹500. For orders below ₹500, we charge ₹50 for metro cities and ₹80 for other locations. Shipping is calculated at checkout.',
  },
  {
    category: 'Ordering & Shipping',
    question: 'How long does delivery take?',
    answer: 'We typically deliver within 3-5 business days for metro cities and 5-7 business days for other locations. Orders are processed within 24 hours on business days.',
  },
  {
    category: 'Ordering & Shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within India. We are working on international shipping and will announce it soon on our website and social media.',
  },
  {
    category: 'Ordering & Shipping',
    question: 'Can I track my order?',
    answer: 'Yes! Once your order is shipped, you will receive a tracking number via email and SMS. You can also track your order from your account dashboard.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery if the product is damaged, defective, or not as described. Please contact our customer support with photos of the product for a quick resolution.',
  },
  {
    category: 'Returns & Refunds',
    question: 'How do I get a refund?',
    answer: 'Once we receive and verify your return, refunds are processed within 5-7 business days to your original payment method. For COD orders, we can process a bank transfer to your account.',
  },
  {
    category: 'Gifting',
    question: 'Do you offer gift packaging?',
    answer: 'Yes! All our products come in premium packaging suitable for gifting. We also offer custom gift boxes for bulk orders - please contact us at hello@mitthuug.com for more details.',
  },
  {
    category: 'Gifting',
    question: 'Can I order in bulk for corporate gifting?',
    answer: 'Absolutely! We offer special discounts for bulk orders (50+ boxes). Please email us at corporate@mitthuug.com with your requirements and we will create a custom quote for you.',
  },
  {
    category: 'Account & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD). All online payments are processed securely through our payment gateway.',
  },
  {
    category: 'Account & Payment',
    question: 'Do I need to create an account to place an order?',
    answer: 'No, you can checkout as a guest. However, creating an account helps you track orders, save addresses, maintain a wishlist, and get exclusive offers.',
  },
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen pt-8 bg-ivory-50">
      <SEO 
        title="Frequently Asked Questions (FAQ) | MitthuuG"
        description="Find answers to common questions about MitthuuG products, shipping, returns, and more. Get help with your til-gud orders."
        keywords="mitthuug faq, til gud questions, product information, shipping info, return policy"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-chocolate-600">
            Find answers to common questions about our products, orders, and policies
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-ochre-500 to-ochre-600 text-white shadow-lg'
                  : 'bg-white text-chocolate-700 hover:bg-ochre-50 border-2 border-ochre-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border-2 border-ochre-100 overflow-hidden transition-all hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-ochre-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <div className="text-xs text-ochre-600 font-bold mb-1">{faq.category}</div>
                  <h3 className="text-lg font-bold text-chocolate-900">{faq.question}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-ochre-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-2">
                  <p className="text-chocolate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-playfair font-bold mb-3">Still have questions?</h2>
          <p className="mb-6 opacity-90">
            We're here to help! Reach out to our customer support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@mitthuug.com"
              className="inline-block px-8 py-3 bg-white text-ochre-600 rounded-full font-bold hover:bg-ochre-50 transition-colors shadow-lg"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-ochre-600 transition-colors"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

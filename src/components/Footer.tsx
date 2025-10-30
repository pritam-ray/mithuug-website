import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Heart, Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-chocolate to-chocolate-800 text-ivory py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-playfair font-bold text-ochre mb-4">
              Mitthuug<span className="italic">_</span>
            </h3>
            <p className="text-sm leading-relaxed text-ivory-200 mb-4">
              Handcrafted GUD Bites that bring warmth, crunch, and nostalgia in every bite. 
              Where tradition meets modern artisan craft.
            </p>
            <div className="flex items-center space-x-2 text-xs text-ochre-200">
              <Leaf className="w-4 h-4" />
              <span>FSSAI Certified | No Refined Sugar</span>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-ochre mb-4">
              SHOP
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className="hover:text-ochre transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="hover:text-ochre transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=bestsellers" className="hover:text-ochre transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gift-sets" className="hover:text-ochre transition-colors">
                  Gift Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-ochre mb-4">
              INFORMATION
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-ochre transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-ochre transition-colors">
                  Blog & Stories
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-ochre transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-ochre transition-colors">
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-ochre mb-4">
              GET IN TOUCH
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-ochre" />
                <a href="mailto:hello@mitthuug.com" className="hover:text-ochre transition-colors">
                  hello@mitthuug.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-ochre" />
                <a href="tel:+919876543210" className="hover:text-ochre transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-ochre" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-ochre-900/30 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-playfair font-bold text-ochre mb-2">
              Join the Mitthu Express Journey
            </h4>
            <p className="text-sm text-ivory-200 mb-4">
              Get exclusive offers, recipe ideas, and behind-the-scenes stories
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border-2 border-ochre-700 rounded-full text-ivory placeholder-ivory-400 focus:outline-none focus:ring-2 focus:ring-ochre"
              />
              <button className="px-6 py-3 bg-ochre text-white rounded-full hover:bg-ochre-600 transition-all font-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ochre-900/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-ivory-300 flex items-center space-x-2">
              <span>© 2025 MitthuuG. Crafted with</span>
              <Heart className="w-4 h-4 fill-ochre text-ochre" />
              <span>in India</span>
            </p>

            <div className="flex items-center space-x-6">
              <a
                href="https://instagram.com/mitthuug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory-300 hover:text-ochre transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="mailto:hello@mitthuug.com"
                className="text-ivory-300 hover:text-ochre transition-colors"
                title="Email us"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Heart, 
  Leaf,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const MobileFooter: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const accordionSections: AccordionSection[] = [
    {
      id: 'shop',
      title: 'SHOP',
      content: (
        <ul className="space-y-3 text-sm pb-4">
          <li>
            <Link 
              to="/shop" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              All Products
            </Link>
          </li>
          <li>
            <Link 
              to="/shop?filter=new" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              New Arrivals
            </Link>
          </li>
          <li>
            <Link 
              to="/shop?filter=bestsellers" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              Bestsellers
            </Link>
          </li>
          <li>
            <Link 
              to="/shop?category=gift-sets" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              Gift Packs
            </Link>
          </li>
        </ul>
      ),
    },
    {
      id: 'information',
      title: 'INFORMATION',
      content: (
        <ul className="space-y-3 text-sm pb-4">
          <li>
            <Link 
              to="/about" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              Blog & Stories
            </Link>
          </li>
          <li>
            <Link 
              to="/faq" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link 
              to="/shipping" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              Shipping Policy
            </Link>
          </li>
          <li>
            <Link 
              to="/returns" 
              className="block py-2 px-4 -mx-4 active:bg-white/10 rounded-lg transition-colors"
            >
              Return Policy
            </Link>
          </li>
        </ul>
      ),
    },
    {
      id: 'contact',
      title: 'GET IN TOUCH',
      content: (
        <ul className="space-y-4 text-sm pb-4">
          <li className="flex items-start space-x-3">
            <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-ochre" />
            <a 
              href="mailto:hello@mitthuug.com" 
              className="block py-2 -my-2 active:text-ochre transition-colors touch-target"
            >
              hello@mitthuug.com
            </a>
          </li>
          <li className="flex items-start space-x-3">
            <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-ochre" />
            <a 
              href="tel:+919876543210" 
              className="block py-2 -my-2 active:text-ochre transition-colors touch-target"
            >
              +91 98765 43210
            </a>
          </li>
          <li className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-ochre" />
            <span className="pt-2">Mumbai, India</span>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <footer 
      id="contact" 
      className="bg-gradient-to-br from-chocolate to-chocolate-800 dark:from-gray-900 dark:to-gray-950 text-ivory dark:text-gray-200 pb-safe"
    >
      {/* Mobile Layout (< md) */}
      <div className="md:hidden px-4 pt-8 pb-20">
        {/* Brand Section - Always Visible */}
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-ochre dark:text-ochre-400 mb-3">
            Mitthuug<span className="italic">_</span>
          </h3>
          <p className="text-sm leading-relaxed text-ivory-200 dark:text-gray-400 mb-3">
            Handcrafted GUD Bites that bring warmth, crunch, and nostalgia in every bite.
          </p>
          <div className="flex items-center space-x-2 text-xs text-ochre-200 dark:text-ochre-400">
            <Leaf className="w-4 h-4" />
            <span>FSSAI Certified | No Refined Sugar</span>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="border-t border-ochre-900/30 pt-6 space-y-2">
          {accordionSections.map((section) => (
            <div key={section.id} className="border-b border-ochre-900/20">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between py-4 touch-target-lg"
                aria-expanded={openSection === section.id}
                aria-controls={`accordion-${section.id}`}
              >
                <span className="text-sm font-bold tracking-widest text-ochre">
                  {section.title}
                </span>
                {openSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-ochre" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ochre" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openSection === section.id && (
                  <motion.div
                    id={`accordion-${section.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.25, delay: 0.05 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.2 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="text-ivory-100 dark:text-gray-300">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Newsletter Section - Mobile Optimized */}
        <div className="border-t border-ochre-900/30 pt-6 mt-6">
          <h4 className="text-base font-playfair font-bold text-ochre mb-2">
            Join the Mitthu Express Journey
          </h4>
          <p className="text-sm text-ivory-200 mb-4">
            Get exclusive offers & recipe ideas
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/10 border-2 border-ochre-700 rounded-full text-ivory placeholder-ivory-400 focus:outline-none focus:ring-2 focus:ring-ochre touch-target-lg"
            />
            <button className="w-full px-6 py-3 bg-ochre text-white rounded-full active:bg-ochre-600 transition-all font-bold touch-target-lg">
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center space-x-8 mt-6 pt-6 border-t border-ochre-900/30">
          <a
            href="https://instagram.com/mitthuug"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ivory-300 active:text-ochre transition-colors touch-target-lg"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="mailto:hello@mitthuug.com"
            className="text-ivory-300 active:text-ochre transition-colors touch-target-lg"
            aria-label="Email us"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        {/* Bottom Bar - Mobile */}
        <div className="mt-6 pt-6 border-t border-ochre-900/30 text-center space-y-3">
          <p className="text-xs text-ivory-300 flex items-center justify-center space-x-2">
            <span>© 2025 MitthuuG. Made with</span>
            <Heart className="w-3 h-3 fill-ochre text-ochre" />
            <span>in India</span>
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <Link to="/privacy" className="active:text-ochre transition-colors py-2 touch-target">
              Privacy
            </Link>
            <span className="text-ivory-300">•</span>
            <Link to="/terms" className="active:text-ochre transition-colors py-2 touch-target">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout (>= md) - Original Footer */}
      <div className="hidden md:block px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-playfair font-bold text-ochre dark:text-ochre-400 mb-4">
                Mitthuug<span className="italic">_</span>
              </h3>
              <p className="text-sm leading-relaxed text-ivory-200 dark:text-gray-400 mb-4">
                Handcrafted GUD Bites that bring warmth, crunch, and nostalgia in every bite. 
                Where tradition meets modern artisan craft.
              </p>
              <div className="flex items-center space-x-2 text-xs text-ochre-200 dark:text-ochre-400">
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
                  <Link to="/faq" className="hover:text-ochre transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-ochre transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-ochre transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:text-ochre transition-colors">
                    Return Policy
                  </Link>
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

              <div className="flex items-center space-x-4 text-sm">
                <Link to="/privacy" className="hover:text-ochre transition-colors">Privacy</Link>
                <span className="text-ivory-300">•</span>
                <Link to="/terms" className="hover:text-ochre transition-colors">Terms</Link>
              </div>

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
      </div>
    </footer>
  );
};

export default MobileFooter;

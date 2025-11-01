import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Breadcrumb from './components/Breadcrumb';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('./pages/AdminProductFormPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-ochre border-t-transparent mb-4"></div>
      <p className="text-chocolate font-playfair text-lg">Loading sweetness...</p>
    </div>
  </div>
);

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <ToastProvider>
                <div className="min-h-screen bg-white">
                  <Navbar onCartClick={() => setIsCartOpen(true)} />
                  <Breadcrumb />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/account/*" element={<AccountPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/shipping" element={<ShippingPolicyPage />} />
                      <Route path="/returns" element={<ReturnPolicyPage />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/admin/products" element={<AdminProductsPage />} />
                      <Route path="/admin/products/new" element={<AdminProductFormPage />} />
                      <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
                      
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                  <Footer />
                  <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>
              </ToastProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}export default App;

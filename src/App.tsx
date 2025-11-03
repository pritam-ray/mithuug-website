import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ReferralProvider } from './context/ReferralContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { ChatWidget } from './components/ChatWidget';
import Breadcrumb from './components/Breadcrumb';
import BottomNav from './components/mobile/BottomNav';
import CartDrawer from './components/mobile/CartDrawer';
import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';

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
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const ProductComparisonPage = lazy(() => import('./pages/ProductComparisonPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ReferralPage = lazy(() => import('./pages/ReferralPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('./pages/AdminProductFormPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminCustomersPage = lazy(() => import('./pages/AdminCustomersPage'));
const AdminReviewModerationPage = lazy(() => import('./pages/AdminReviewModerationPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'));
const AdminBulkOperationsPage = lazy(() => import('./pages/AdminBulkOperationsPage'));
const AdminChatPage = lazy(() => import('./pages/AdminChatPage'));

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ToastProvider>
          <ThemeProvider>
            <AuthProvider>
              <AdminProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ComparisonProvider>
                      <SubscriptionProvider>
                        <ReferralProvider>
                          <ChatProvider>
                            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                              <Navbar onCartClick={() => setIsCartOpen(true)} />
                              <Breadcrumb />
                              
                              {/* Main Content with bottom padding for mobile nav */}
                              <div className="pb-0 md:pb-0 mb-16 md:mb-0">
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
                      <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
                        <Route path="/compare" element={<ProductComparisonPage />} />
                        <Route path="/subscriptions" element={<SubscriptionPage />} />
                        <Route path="/referrals" element={<ReferralPage />} />
                        <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/shipping" element={<ShippingPolicyPage />} />
                      <Route path="/returns" element={<ReturnPolicyPage />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/admin/products" element={<AdminProductsPage />} />
                      <Route path="/admin/products/new" element={<AdminProductFormPage />} />
                      <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
                      <Route path="/admin/orders" element={<AdminOrdersPage />} />
                      <Route path="/admin/customers" element={<AdminCustomersPage />} />
                      <Route path="/admin/reviews" element={<AdminReviewModerationPage />} />
                      <Route path="/admin/settings" element={<AdminSettingsPage />} />
                      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                      <Route path="/admin/bulk-operations" element={<AdminBulkOperationsPage />} />
                      <Route path="/admin/chat" element={<AdminChatPage />} />
                      
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                              </div>
                              {/* End Main Content */}
                              
                              <Footer />
                              
                              {/* Desktop Cart Modal */}
                              <div className="hidden md:block">
                                <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                              </div>
                              
                              {/* Mobile Cart Drawer */}
                              <div className="md:hidden">
                                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                              </div>
                              
                              <ChatWidget />
                              
                              {/* Mobile Bottom Navigation */}
                              <BottomNav />
                            </div>
                          </ChatProvider>
                        </ReferralProvider>
                      </SubscriptionProvider>
                    </ComparisonProvider>
                  </WishlistProvider>
                </CartProvider>
              </AdminProvider>
            </AuthProvider>
          </ThemeProvider>
        </ToastProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

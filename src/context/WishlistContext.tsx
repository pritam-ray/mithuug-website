import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Product } from '../types/database';

interface WishlistContextType {
  wishlistItems: Product[];
  wishlistIds: Set<string>;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount and user change
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
      setWishlistIds(new Set());
      setLoading(false);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const products = data?.map((item: any) => item.products).filter(Boolean) || [];
      const ids = new Set(data?.map((item: any) => item.product_id) || []);

      setWishlistItems(products);
      setWishlistIds(ids);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;

      // Reload wishlist
      await loadWishlist();
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      if (!error.message.includes('duplicate')) {
        alert('Failed to add to wishlist');
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      // Update local state immediately
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems([]);
      setWishlistIds(new Set());
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      alert('Failed to clear wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistIds,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

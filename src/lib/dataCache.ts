/**
 * Global Data Cache Service
 * Implements in-memory caching for frequently accessed data to reduce database queries
 */

import { supabase } from './supabase';
import { Product, Category } from '../types/database';
import { mitthuugProducts } from '../data/products';

const localProducts: Product[] = mitthuugProducts.map(p => ({
  id: p.sku,
  name: p.title,
  description: p.long_desc || p.short_desc,
  price: p.price,
  image_url: p.image_url,
  images: [p.image_url],
  category: p.category,
  weight: p.weight,
  ingredients: p.ingredients ? p.ingredients.split(',').map(i => i.trim()) : [],
  stock_quantity: 100,
  is_new: p.is_new || false,
  is_bestseller: p.is_bestseller || false,
  discount_percentage: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const localCategories: Category[] = [
  {
    id: 'gud-bites',
    name: 'Gud Bites',
    slug: 'gud-bites',
    description: 'Delicious sesame and jaggery bites.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'trial-pack',
    name: 'Trial Pack',
    slug: 'trial-pack',
    description: 'Perfect for first-timers.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gift-sets',
    name: 'Gift Sets',
    slug: 'gift-sets',
    description: 'Premium gift sets for all occasions.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'traditional',
    name: 'Traditional',
    slug: 'traditional',
    description: 'Traditional sweets made with love.',
    created_at: new Date().toISOString(),
  }
];

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default cache time

  /**
   * Get data from cache or fetch from database
   */
  private async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if still valid
    if (cached && cached.expiresAt > now) {
      return cached.data as T;
    }

    // Fetch fresh data
    const data = await fetcher();
    
    // Store in cache
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });

    return data;
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all products (cached for 5 minutes)
   */
  async getAllProducts(): Promise<Product[]> {
    return this.getOrFetch(
      'products:all',
      async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          if (data && data.length > 0) return data;
        } catch (e) {
          console.warn('Supabase fetch failed or empty for all products, using local fallback:', e);
        }
        return localProducts;
      },
      5 * 60 * 1000 // 5 minutes
    );
  }

  /**
   * Get new products (cached for 10 minutes)
   */
  async getNewProducts(limit: number = 3): Promise<Product[]> {
    return this.getOrFetch(
      `products:new:${limit}`,
      async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_new', true)
            .limit(limit);
          
          if (error) throw error;
          if (data && data.length > 0) return data;
        } catch (e) {
          console.warn('Supabase fetch failed or empty for new products, using local fallback:', e);
        }
        return localProducts.filter(p => p.is_new).slice(0, limit);
      },
      10 * 60 * 1000 // 10 minutes
    );
  }

  /**
   * Get bestseller products (cached for 10 minutes)
   */
  async getBestsellers(limit: number = 3): Promise<Product[]> {
    return this.getOrFetch(
      `products:bestsellers:${limit}`,
      async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_bestseller', true)
            .limit(limit);
          
          if (error) throw error;
          if (data && data.length > 0) return data;
        } catch (e) {
          console.warn('Supabase fetch failed or empty for bestseller products, using local fallback:', e);
        }
        return localProducts.filter(p => p.is_bestseller).slice(0, limit);
      },
      10 * 60 * 1000 // 10 minutes
    );
  }

  /**
   * Get single product by ID (cached for 5 minutes)
   */
  async getProduct(id: string): Promise<Product | null> {
    return this.getOrFetch(
      `product:${id}`,
      async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          if (data) return data;
        } catch (e) {
          console.warn(`Supabase fetch failed or empty for product ${id}, using local fallback:`, e);
        }
        return localProducts.find(p => p.id === id) || null;
      },
      5 * 60 * 1000 // 5 minutes
    );
  }

  /**
   * Get all categories (cached for 30 minutes - rarely changes)
   */
  async getCategories(): Promise<Category[]> {
    return this.getOrFetch(
      'categories:all',
      async () => {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*');
          
          if (error) throw error;
          if (data && data.length > 0) return data;
        } catch (e) {
          console.warn('Supabase fetch failed or empty for categories, using local fallback:', e);
        }
        return localCategories;
      },
      30 * 60 * 1000 // 30 minutes - categories change rarely
    );
  }

  /**
   * Prefetch all common data (call on app initialization)
   */
  async prefetchCommonData(): Promise<void> {
    try {
      await Promise.all([
        this.getAllProducts(),
        this.getCategories(),
        this.getNewProducts(6),
        this.getBestsellers(6),
      ]);
    } catch (error) {
      console.error('Error prefetching data:', error);
    }
  }
}

// Export singleton instance
export const dataCache = new DataCache();

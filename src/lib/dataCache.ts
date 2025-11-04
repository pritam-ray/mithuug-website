/**
 * Global Data Cache Service
 * Implements in-memory caching for frequently accessed data to reduce database queries
 */

import { supabase } from './supabase';
import { Product, Category } from '../types/database';

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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new', true)
          .limit(limit);
        
        if (error) throw error;
        return data || [];
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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .limit(limit);
        
        if (error) throw error;
        return data || [];
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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
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
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) throw error;
        return data || [];
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

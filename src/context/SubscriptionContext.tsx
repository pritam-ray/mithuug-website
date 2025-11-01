import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { Product } from '../types/database';

export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  custom_interval_days: number | null;
  status: SubscriptionStatus;
  discount_percentage: number;
  next_delivery_date: string;
  last_order_id: string | null;
  last_delivery_date: string | null;
  total_orders_created: number;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  product?: Product;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
  loadSubscriptions: () => Promise<void>;
  createSubscription: (
    productId: string,
    quantity: number,
    frequency: SubscriptionFrequency,
    customIntervalDays?: number
  ) => Promise<void>;
  updateSubscription: (
    subscriptionId: string,
    updates: Partial<Pick<Subscription, 'quantity' | 'frequency' | 'custom_interval_days' | 'status'>>
  ) => Promise<void>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string, reason?: string) => Promise<void>;
  deleteSubscription: (subscriptionId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    } else {
      setSubscriptions([]);
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSubscriptions = data?.map((sub: any) => ({
        ...sub,
        product: sub.products,
      })) || [];

      setSubscriptions(formattedSubscriptions);
    } catch (error: any) {
      console.error('Error loading subscriptions:', error);
      showToast('error', 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (
    productId: string,
    quantity: number,
    frequency: SubscriptionFrequency,
    customIntervalDays?: number
  ) => {
    if (!user) {
      showToast('error', 'Please log in to create a subscription');
      return;
    }

    try {
      // Calculate next delivery date (7 days from now by default)
      const nextDate = new Date();
      if (frequency === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (frequency === 'biweekly') {
        nextDate.setDate(nextDate.getDate() + 14);
      } else if (frequency === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (frequency === 'custom' && customIntervalDays) {
        nextDate.setDate(nextDate.getDate() + customIntervalDays);
      }

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
          frequency,
          custom_interval_days: frequency === 'custom' ? customIntervalDays : null,
          next_delivery_date: nextDate.toISOString().split('T')[0],
          status: 'active',
          discount_percentage: 10, // Default 10% discount
        });

      if (error) throw error;

      showToast('success', 'Subscription created successfully! Save 10% on every delivery.');
      await loadSubscriptions();
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      showToast('error', error.message || 'Failed to create subscription');
    }
  };

  const updateSubscription = async (
    subscriptionId: string,
    updates: Partial<Pick<Subscription, 'quantity' | 'frequency' | 'custom_interval_days' | 'status'>>
  ) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subscriptionId);

      if (error) throw error;

      showToast('success', 'Subscription updated successfully');
      await loadSubscriptions();
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      showToast('error', error.message || 'Failed to update subscription');
    }
  };

  const pauseSubscription = async (subscriptionId: string) => {
    await updateSubscription(subscriptionId, { status: 'paused' });
  };

  const resumeSubscription = async (subscriptionId: string) => {
    await updateSubscription(subscriptionId, { status: 'active' });
  };

  const cancelSubscription = async (subscriptionId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason || null,
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      showToast('info', 'Subscription cancelled');
      await loadSubscriptions();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      showToast('error', error.message || 'Failed to cancel subscription');
    }
  };

  const deleteSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) throw error;

      showToast('success', 'Subscription deleted');
      await loadSubscriptions();
    } catch (error: any) {
      console.error('Error deleting subscription:', error);
      showToast('error', error.message || 'Failed to delete subscription');
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        loading,
        loadSubscriptions,
        createSubscription,
        updateSubscription,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

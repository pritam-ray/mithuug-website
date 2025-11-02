import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export type ReferralStatus = 'pending' | 'completed' | 'expired' | 'cancelled';

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  discount_percentage: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referral_code_id: string;
  status: ReferralStatus;
  order_id: string | null;
  referrer_reward_amount: number;
  referred_discount_amount: number;
  completed_at: string | null;
  created_at: string;
}

export interface ReferralStats {
  total_referrals: number;
  pending_referrals: number;
  completed_referrals: number;
  total_earnings: number;
  total_code_uses: number;
}

interface ReferralContextType {
  referralCodes: ReferralCode[];
  referrals: Referral[];
  stats: ReferralStats | null;
  loading: boolean;
  loadReferralData: () => Promise<void>;
  createReferralCode: (discountPercentage?: number, maxUses?: number, expiresInDays?: number) => Promise<void>;
  shareReferralLink: (code: string) => void;
  getReferralLink: (code: string) => string;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export const ReferralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      loadReferralData();
    } else {
      setReferralCodes([]);
      setReferrals([]);
      setStats(null);
      setLoading(false);
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load referral codes
      const { data: codes, error: codesError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;
      setReferralCodes(codes || []);

      // Load referrals
      const { data: refs, error: refsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (refsError) throw refsError;
      setReferrals(refs || []);

      // Load stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_referral_stats', { p_user_id: user.id });

      if (statsError) throw statsError;
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }
    } catch (error: any) {
      console.error('Error loading referral data:', error);
      showToast('error', 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const createReferralCode = async (
    discountPercentage: number = 10,
    maxUses?: number,
    expiresInDays?: number
  ) => {
    if (!user) {
      showToast('error', 'Please log in to create a referral code');
      return;
    }

    try {
      // Generate code using RPC function
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_referral_code', { p_user_id: user.id });

      if (codeError) throw codeError;

      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Create referral code
      const { error: insertError } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code: codeData,
          discount_percentage: discountPercentage,
          max_uses: maxUses || null,
          expires_at: expiresAt,
          is_active: true,
        });

      if (insertError) throw insertError;

      showToast('success', `Referral code ${codeData} created! Share it with friends.`);
      await loadReferralData();
    } catch (error: any) {
      console.error('Error creating referral code:', error);
      showToast('error', error.message || 'Failed to create referral code');
    }
  };

  const getReferralLink = (code: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${code}`;
  };

  const shareReferralLink = async (code: string) => {
    const link = getReferralLink(code);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join MitthuuG with my referral code!',
          text: `Use my referral code ${code} to get 10% off on your first order at MitthuuG - Premium Til-Gud & Traditional Indian Sweets!`,
          url: link,
        });
        showToast('success', 'Referral link shared!');
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(link);
        }
      }
    } else {
      copyToClipboard(link);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showToast('success', 'Referral link copied to clipboard!');
      },
      () => {
        showToast('error', 'Failed to copy link');
      }
    );
  };

  return (
    <ReferralContext.Provider
      value={{
        referralCodes,
        referrals,
        stats,
        loading,
        loadReferralData,
        createReferralCode,
        shareReferralLink,
        getReferralLink,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};

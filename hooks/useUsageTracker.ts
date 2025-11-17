
import { useState, useEffect, useCallback } from 'react';

const USAGE_KEY = 'multiPowerAIUsage';
const INITIAL_FREE_ROUNDS = 10;

interface UsageData {
  rounds: number;
  isInitialTier: boolean;
  subscriptionTier: 'none' | 'monthly' | 'yearly';
  subscriptionExpires: number | null;
}

const getInitialUsage = (): UsageData => {
  try {
    const saved = localStorage.getItem(USAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // Migration for older data structures ('cycles' -> 'rounds')
      const rounds = typeof data.rounds === 'number' ? data.rounds : (typeof data.cycles === 'number' ? data.cycles : 0);
      const isInitialTier = typeof data.isInitialTier === 'boolean' ? data.isInitialTier : false;
      const subscriptionTier = ['none', 'monthly', 'yearly'].includes(data.subscriptionTier) ? data.subscriptionTier : 'none';
      const subscriptionExpires = typeof data.subscriptionExpires === 'number' ? data.subscriptionExpires : null;
      
      return { rounds, isInitialTier, subscriptionTier, subscriptionExpires };
    }
  } catch (error)    {
    console.error("Failed to read usage data from localStorage", error);
  }
  // Default for new users
  return { rounds: INITIAL_FREE_ROUNDS, isInitialTier: true, subscriptionTier: 'none', subscriptionExpires: null };
};

export const useUsageTracker = () => {
  const [usage, setUsage] = useState<UsageData>(getInitialUsage);
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);

  useEffect(() => {
    try {
      // Clean up old 'cycles' key if present during migration
      const dataToSave = { ...usage };
      if ('cycles' in dataToSave) {
        delete (dataToSave as any).cycles;
      }
      localStorage.setItem(USAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save usage data to localStorage", error);
    }
  }, [usage]);

  const hasActiveSubscription = usage.subscriptionTier !== 'none' && (usage.subscriptionExpires === null || usage.subscriptionExpires > Date.now());

  const canRunRound = hasActiveSubscription || usage.rounds > 0;

  const consumeRound = useCallback(() => {
    if (hasActiveSubscription) {
      return true; // Don't consume rounds on an active subscription
    }
    if (usage.rounds > 0) {
      setUsage(prev => ({ ...prev, rounds: prev.rounds - 1 }));
      return true;
    }
    return false;
  }, [hasActiveSubscription, usage.rounds]);
  
  const addRounds = useCallback((amount: number) => {
    setUsage(prev => ({
      ...prev,
      rounds: prev.rounds + amount,
      isInitialTier: false, 
    }));
    setIsPaywallVisible(false);
  }, []);

  const activateSubscription = useCallback((tier: 'monthly' | 'yearly') => {
    const now = new Date();
    let expirationDate: Date;
    if (tier === 'monthly') {
      expirationDate = new Date(now.setMonth(now.getMonth() + 1));
    } else { // yearly
      expirationDate = new Date(now.setFullYear(now.getFullYear() + 1));
    }

    setUsage(prev => ({
      ...prev,
      isInitialTier: false,
      subscriptionTier: tier,
      subscriptionExpires: expirationDate.getTime(),
    }));
    setIsPaywallVisible(false);
  }, []);


  const showPaywall = () => setIsPaywallVisible(true);
  const hidePaywall = () => setIsPaywallVisible(false);

  return {
    remainingRounds: usage.rounds,
    isFreeTier: usage.isInitialTier,
    hasActiveSubscription,
    canRunRound,
    isPaywallVisible,
    consumeRound,
    addRounds,
    activateSubscription,
    showPaywall,
    hidePaywall,
  };
};
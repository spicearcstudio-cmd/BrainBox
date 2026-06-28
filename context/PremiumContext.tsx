import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadData, saveData } from '../services/storage';

interface PremiumCtx {
  isPremium: boolean;
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
}

const PremiumContext = createContext<PremiumCtx>({
  isPremium: false,
  purchase: async () => {},
  restore: async () => {},
});

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadData('premium').then(val => { if (val === 'true') setIsPremium(true); });
  }, []);

  const purchase = useCallback(async () => {
    // In production, this would call react-native-iap.
    // For development, simulate a successful purchase.
    setIsPremium(true);
    await saveData('premium', 'true');
  }, []);

  const restore = useCallback(async () => {
    const val = await loadData('premium');
    if (val === 'true') setIsPremium(true);
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, purchase, restore }}>
      {children}
    </PremiumContext.Provider>
  );
}

export const usePremium = () => useContext(PremiumContext);

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { loadData, saveData } from '../services/storage';

const PREMIUM_SKU = 'brainbox_premium';

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

async function loadIAP(): Promise<any | null> {
  try { return await import(/* webpackIgnore: true */ 'react-native-iap' as any); } catch { return null; }
}

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadData('premium').then(val => { if (val === 'true') setIsPremium(true); });
    loadIAP().then(iap => { if (iap) iap.initConnection().catch(() => {}); });
  }, []);

  const purchase = useCallback(async () => {
    const RNIap = await loadIAP();
    if (!RNIap) { Alert.alert('Not Available', 'In-app purchases are not available on this device.'); return; }
    try {
      const products = await RNIap.fetchProducts({ skus: [PREMIUM_SKU] });
      if (!products || products.length === 0) {
        Alert.alert('Not Available', 'Premium is not available right now. Please try again later.');
        return;
      }
      await RNIap.requestPurchase({
        request: { apple: { sku: PREMIUM_SKU }, google: { skus: [PREMIUM_SKU] } },
        type: 'in-app',
      });
      setIsPremium(true);
      await saveData('premium', 'true');
    } catch (err: any) {
      if (err?.code === 'E_USER_CANCELLED') return;
      Alert.alert('Purchase Failed', 'Could not complete the purchase. Please try again.');
    }
  }, []);

  const restore = useCallback(async () => {
    const RNIap = await loadIAP();
    if (!RNIap) { Alert.alert('Not Available', 'In-app purchases are not available on this device.'); return; }
    try {
      const purchases = await RNIap.getAvailablePurchases();
      const hasPremium = purchases.some((p: any) => p.productId === PREMIUM_SKU);
      if (hasPremium) {
        setIsPremium(true);
        await saveData('premium', 'true');
        Alert.alert('Restored!', 'Your premium purchase has been restored.');
      } else {
        Alert.alert('No Purchase Found', 'No previous premium purchase was found for this account.');
      }
    } catch {
      const localPremium = await loadData('premium');
      if (localPremium === 'true') {
        setIsPremium(true);
      } else {
        Alert.alert('Restore Failed', 'Could not check purchases. Please try again.');
      }
    }
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, purchase, restore }}>
      {children}
    </PremiumContext.Provider>
  );
}

export const usePremium = () => useContext(PremiumContext);

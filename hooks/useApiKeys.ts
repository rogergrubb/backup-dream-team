import { useState, useCallback, useEffect } from 'react';
import { db } from '../lib/firebaseClient';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

export type ApiProviders = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'grok' | 'kimi';
export type ApiKeys = Record<ApiProviders, string>;

const emptyKeys: ApiKeys = {
  gemini: '',
  openai: '',
  anthropic: '',
  deepseek: '',
  grok: '',
  kimi: '',
};

export const useApiKeys = () => {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKeys>(emptyKeys);
  const [loading, setLoading] = useState(true);

  const fetchKeys = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userApiKeysRef = doc(db, 'userApiKeys', user.uid);
      const docSnap = await getDoc(userApiKeysRef);

      const fetchedKeys = { ...emptyKeys };
      if (docSnap.exists()) {
        const data = docSnap.data();
        for (const provider in fetchedKeys) {
            // We don't store the actual keys on the client, just an indicator that they are set.
            if (data[provider as ApiProviders]) {
                fetchedKeys[provider as ApiProviders] = '••••••••••••';
            }
        }
      }
      setKeys(fetchedKeys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const saveKeys = useCallback(async (newKeys: ApiKeys) => {
    if (!user) throw new Error("User must be logged in to save API keys.");

    const userApiKeysRef = doc(db, 'userApiKeys', user.uid);
    const updates: Partial<Record<ApiProviders, string>> = {};
    
    for (const provider of Object.keys(newKeys) as ApiProviders[]) {
      const key = newKeys[provider];
      // Only update if the key is new and not the placeholder
      if (key && key !== '••••••••••••') {
        // In a real app, you would send this to a cloud function to be encrypted.
        // For this demo, we'll store it directly, but this is NOT secure for production.
        // The Cloud Function will actually use the secure keys.
        updates[provider] = key;
      }
    }
    
    if(Object.keys(updates).length > 0) {
        // Using set with merge:true is like an upsert
        await setDoc(userApiKeysRef, updates, { merge: true });
    }

    await fetchKeys();
  }, [user, fetchKeys]);

  const isConfigured = useCallback((provider: ApiProviders): boolean => {
    return !!keys[provider];
  }, [keys]);

  return { keys, saveKeys, isConfigured, loading, refetch: fetchKeys };
};
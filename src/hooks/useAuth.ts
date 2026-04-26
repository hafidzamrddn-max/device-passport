'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setApiKey(key);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('gemini_api_key');
    router.push('/login');
  };

  return { isAuthenticated, apiKey, logout };
};

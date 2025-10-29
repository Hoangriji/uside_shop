import { useState, useEffect } from 'react';
import type { SiteConfig } from '../types';
import { SiteConfigService } from '../services/firebaseService';

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates from Firebase
    const unsubscribe = SiteConfigService.subscribeToSiteConfig((updatedConfig) => {
      setConfig(updatedConfig as unknown as SiteConfig);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { config, loading, error: null };
};
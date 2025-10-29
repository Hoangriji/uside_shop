import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { CategoriesService } from '../services/firebaseService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates from Firebase
    const unsubscribe = CategoriesService.subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories as unknown as Category[]);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {
    categories,
    loading,
    error: null,
  };
};
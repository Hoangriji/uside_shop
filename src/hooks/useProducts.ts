import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { ProductsService } from '../services/firebaseService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates from Firebase
    const unsubscribe = ProductsService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const mutate = () => {
    // Trigger re-fetch manually if needed
    setLoading(true);
    const unsubscribe = ProductsService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
    });
    return unsubscribe;
  };

  return {
    products,
    loading,
    error: null,
    mutate,
  };
};
import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { ProductsService } from '../services/firebaseService';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

// Calculate products per page based on viewport
const calculateProductsPerPage = () => {
  // Assume product card height ~350px, grid with gaps
  const cardHeight = 380; // card + gap
  const viewportHeight = window.innerHeight;
  const headerHeight = 100; // approximate header height
  const availableHeight = viewportHeight - headerHeight;
  
  // Calculate rows that fit in viewport
  const rowsInViewport = Math.ceil(availableHeight / cardHeight);
  
  // Grid columns: desktop ~4-5, tablet ~3-4, mobile ~2
  const gridColumns = window.innerWidth >= 1200 ? 4 : window.innerWidth >= 768 ? 3 : 2;
  
  // Load enough for 2 viewports worth (current + 1 below for smooth scroll)
  const productsPerPage = rowsInViewport * gridColumns * 2;
  
  // Minimum 12, maximum 24
  return Math.min(Math.max(productsPerPage, 12), 24);
};

export const useProductsPaginated = () => {
  const [pageSize] = useState(calculateProductsPerPage());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const loadInitialProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { products: initialProducts, lastDoc: lastVisible } = 
        await ProductsService.getPaginatedProducts(pageSize);
      
      setProducts(initialProducts);
      setLastDoc(lastVisible);
      setHasMore(initialProducts.length === pageSize);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Initial load
  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  // Load more products
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    try {
      setLoadingMore(true);
      setError(null);
      const { products: moreProducts, lastDoc: lastVisible } = 
        await ProductsService.getPaginatedProducts(pageSize, lastDoc);
      
      setProducts(prev => [...prev, ...moreProducts]);
      setLastDoc(lastVisible);
      setHasMore(moreProducts.length === pageSize);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastDoc, pageSize]);

  // Reset and reload
  const refresh = useCallback(async () => {
    setProducts([]);
    setLastDoc(null);
    setHasMore(true);
    await loadInitialProducts();
  }, [loadInitialProducts]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  };
};

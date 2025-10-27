import useSWR from 'swr';
import type { Product } from '../types';
import { fetcher } from '../lib/swr-config';

interface ProductsResponse {
  products: Product[];
}

export const useProducts = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ProductsResponse>(
    '/data/products.json',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Auto refresh mỗi 30s
      dedupingInterval: 5000,
      keepPreviousData: true, // Giữ data cũ khi revalidating
    }
  );

  return {
    products: data?.products || [],
    loading: isLoading,
    isValidating, // Đang background refresh
    error: error?.message || null,
    mutate, // Để manually trigger revalidation nếu cần
  };
};
import useSWR from 'swr';
import type { Category } from '../types';
import { fetcher } from '../lib/swr-config';

interface CategoriesResponse {
  categories: Category[];
}

export const useCategories = () => {
  const { data, error, isLoading } = useSWR<CategoriesResponse>(
    '/data/categories.json',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // Categories ít thay đổi hơn, refresh mỗi 60s
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  );

  return {
    categories: data?.categories || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
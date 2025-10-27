import type { SWRConfiguration } from 'swr';

// Fetcher function cho SWR
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};

// SWR global config
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true, // Tự động fetch khi user quay lại tab
  revalidateOnReconnect: true, // Tự động fetch khi reconnect internet
  refreshInterval: 30000, // Auto refresh mỗi 30 giây
  dedupingInterval: 5000, // Tránh duplicate requests trong 5s
  errorRetryCount: 3, // Retry 3 lần nếu lỗi
  errorRetryInterval: 2000, // Đợi 2s giữa các retry
  shouldRetryOnError: true,
  // Giữ data cũ khi revalidating để tránh giật
  keepPreviousData: true,
};

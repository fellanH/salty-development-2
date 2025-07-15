// =============================================================================
// USE BEACHES HOOK
// =============================================================================

import useSWR from 'swr';
import { FeatureCollection } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useBeaches() {
  const { data, error } = useSWR<FeatureCollection>(
    '/api/beaches/collection',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    beaches: data?.features || [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useBeach(id: string) {
  const { data, error } = useSWR(
    id ? `/api/beaches/${id}` : null,
    fetcher
  );

  return {
    beach: data,
    isLoading: !error && !data,
    isError: error,
  };
}
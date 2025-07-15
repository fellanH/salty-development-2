// =============================================================================
// USE POIS HOOK
// =============================================================================

import useSWR from 'swr';
import { FeatureCollection } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePOIs() {
  const { data, error } = useSWR<FeatureCollection>(
    '/api/pois/collection',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    pois: data?.features || [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePOI(id: string) {
  const { data, error } = useSWR(
    id ? `/api/pois/${id}` : null,
    fetcher
  );

  return {
    poi: data,
    isLoading: !error && !data,
    isError: error,
  };
}
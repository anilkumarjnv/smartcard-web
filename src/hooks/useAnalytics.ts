// src/hooks/useAnalytics.ts
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export function useAnalytics(cardId: string | undefined) {
  const shouldFetch = Boolean(cardId);
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/analytics/${cardId}` : null,
    fetcher,
    { refreshInterval: 60_000 } // refresh every 60s
  );
  return { data, error, isLoading, mutate };
}

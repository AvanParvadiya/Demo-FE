import { useState, useEffect, useCallback, useRef } from "react";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib";
import { getErrorMessage } from "@/lib/apiTypes";

interface UseApiGetOptions<T> {
  /** Initial data before the fetch resolves */
  initialData?: T;
  /** If false, skips the automatic fetch on mount */
  enabled?: boolean;
}

interface UseApiGetReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for GET requests — fetches data on mount and provides a refetch function.
 *
 * @example
 * const { data, loading, error, refetch } = useApiGet<User[]>("/users");
 */
export function useApiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseApiGetOptions<T>
): UseApiGetReturn<T> {
  const { initialData, enabled = true } = options ?? {};
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // Stable reference for config to avoid infinite re-fetches
  const configRef = useRef(config);
  configRef.current = config;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<T>(url, configRef.current);
      setData(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib";
import {
  PaginatedResponse,
  PaginationParams,
  buildQueryParams,
  getErrorMessage,
} from "@/lib/apiTypes";

interface UsePaginatedApiReturn<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  refetch: () => Promise<void>;
}

/**
 * Hook for paginated list endpoints.
 * Manages page, limit, search, and sort state internally.
 *
 * @example
 * const { data, loading, page, setPage, setSearch } = usePaginatedApi<User>("/users");
 */
export function usePaginatedApi<T>(
  url: string,
  initialParams?: Partial<PaginationParams>
): UsePaginatedApiReturn<T> {
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PaginatedResponse<T>>(url, {
        params: buildQueryParams(paramsRef.current),
      });
      const res = response.data;
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [params, fetchData]);

  const setPage = useCallback(
    (page: number) => setParams((prev) => ({ ...prev, page })),
    []
  );

  const setLimit = useCallback(
    (limit: number) => setParams((prev) => ({ ...prev, limit, page: 1 })),
    []
  );

  const setSearch = useCallback(
    (search: string) => setParams((prev) => ({ ...prev, search, page: 1 })),
    []
  );

  const setSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") =>
      setParams((prev) => ({ ...prev, sortBy, sortOrder })),
    []
  );

  return {
    data,
    total,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    totalPages,
    loading,
    error,
    setPage,
    setLimit,
    setSearch,
    setSort,
    refetch: fetchData,
  };
}

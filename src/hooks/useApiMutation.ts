import { useState, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib";
import { getErrorMessage } from "@/lib/apiTypes";

type HttpMethod = "post" | "put" | "patch" | "delete";

interface UseApiMutationOptions {
  /** Callback on successful response */
  onSuccess?: (data: unknown) => void;
  /** Callback on error */
  onError?: (error: string) => void;
}

interface UseApiMutationReturn<TBody, TResponse> {
  mutate: (body?: TBody) => Promise<TResponse | undefined>;
  data: TResponse | undefined;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for write operations (POST / PUT / PATCH / DELETE).
 * Call `mutate(body)` to fire the request.
 *
 * @example
 * const { mutate, loading, error } = useApiMutation<CreateUserDto, User>("post", "/users");
 * const user = await mutate({ name: "John", email: "john@test.com" });
 */
export function useApiMutation<TBody = unknown, TResponse = unknown>(
  method: HttpMethod,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseApiMutationOptions
): UseApiMutationReturn<TBody, TResponse> {
  const [data, setData] = useState<TResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setLoading(false);
  }, []);

  const mutate = useCallback(
    async (body?: TBody): Promise<TResponse | undefined> => {
      setLoading(true);
      setError(null);
      try {
        let response;

        if (method === "delete") {
          response = await apiClient.delete<TResponse>(url, config);
        } else {
          response = await apiClient[method]<TResponse>(url, body, config);
        }

        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        options?.onError?.(message);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [method, url, config, options]
  );

  return { mutate, data, loading, error, reset };
}

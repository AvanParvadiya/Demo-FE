import { AxiosError, AxiosRequestConfig } from "axios";

// ── Standard API response shape ──────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// ── Paginated response (matches NestJS paginated DTOs) ───────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Pagination request params ────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Typed error ──────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/** Extract a user-friendly error message from an Axios error */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    return data?.message || error.message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

/** Build query string from PaginationParams */
export function buildQueryParams(
  params: PaginationParams
): AxiosRequestConfig["params"] {
  const query: Record<string, string | number> = {};
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.search) query.search = params.search;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;
  return query;
}

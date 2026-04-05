/**
 * Centralized API endpoint definitions.
 * All endpoints are relative to the apiClient baseURL.
 * Never hardcode full URLs in components — import from here.
 */

const API_VERSION = "/v0";

export const API_ENDPOINTS = {
  // ── OTP ────────────────────────────────────────────────────────────
  OTP: {
    SEND: `${API_VERSION}/otp/send`,
    VERIFY: `${API_VERSION}/otp/verify`,
  },

  // ── Users ──────────────────────────────────────────────────────────
  USERS: {
    LIST: `${API_VERSION}/users`,
    DETAIL: (id: string | number) => `${API_VERSION}/users/${id}`,
    CREATE: `${API_VERSION}/users`,
  },

  // ── Audit ──────────────────────────────────────────────────────────
  AUDIT: {
    LIST: `${API_VERSION}/audit`,
    DETAIL: (id: string | number) => `${API_VERSION}/audit/${id}`,
  },
} as const;

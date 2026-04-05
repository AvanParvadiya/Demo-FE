/**
 * Centralized API endpoint definitions.
 * All endpoints are relative to the apiClient baseURL.
 * Never hardcode full URLs in components — import from here.
 */

const API_VERSION = "/v0";

export const API_ENDPOINTS = {
  // ── OTP ────────────────────────────────────────────────────────────
  OTP: {
    SEND: `${API_VERSION}/users/send-otp`,
    VERIFY: `${API_VERSION}/users/verify-otp`,
  },


  // ── Users ──────────────────────────────────────────────────────────
  USERS: {
    LIST: `${API_VERSION}/users`,
    DETAIL: (id: string | number) => `${API_VERSION}/users/${id}`,
    CREATE: `${API_VERSION}/users`,
    REGISTER: `${API_VERSION}/users/register`,
  },

} as const;

import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token if present
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid — clear storage and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
      }

      if (status === 403) {
        console.error("Forbidden: You do not have access to this resource.");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

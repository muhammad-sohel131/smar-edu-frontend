import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Suppress expected 401/403 unauthenticated session checks
    const status = err.response?.status;
    const url = err.config?.url || "";
    const isSessionCheck =
      (status === 401 || status === 403) &&
      (url.includes("/user/me") || url.includes("/auth/"));

    if (!isSessionCheck) {
      const errMsg = err.response?.data?.message || err.message || "Unknown error";
      console.warn("API Error:", errMsg);
    }
    return Promise.reject(err);
  }
);

export default api;

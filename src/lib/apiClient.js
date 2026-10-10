import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Suppress expected 401 unauthenticated check on /user/me
    const isSessionCheck =
      err.response?.status === 401 && err.config?.url?.includes("/user/me");

    if (!isSessionCheck) {
      console.error("API Error:", err.response?.data || err.message);
    }
    return Promise.reject(err);
  }
);

export default api;

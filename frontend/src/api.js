import axios from "axios";

// The backend address comes from the environment, never hardcoded.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL });

// Attach the saved login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorText = (err) =>
  err.response?.data?.message || (err.request ? "Cannot reach the server. Try again." : err.message);

export default api;

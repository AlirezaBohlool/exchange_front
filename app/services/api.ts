import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if you need cookies for auth
});

// Generic request helpers
export const get = (url: string, config = {}) => api.get(url, config);
export const post = (url: string, data: any, config = {}) => api.post(url, data, config);
export const put = (url: string, data: any, config = {}) => api.put(url, data, config);
export const del = (url: string, config = {}) => api.delete(url, config);

export default api;

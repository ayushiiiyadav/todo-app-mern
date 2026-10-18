import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const errorMessage = (err, fallback = "Something went wrong") =>
  err.response?.data?.errors?.[0]?.message ||
  err.response?.data?.message ||
  fallback;
//"https://real-estate-4391.onrender.com/api"
import axios, { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to add auth token and handle content type
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const baseURL = config.baseURL ?? "";
    const url = config.url ?? "";
    console.log("[v0] Making API request to:", `${baseURL}${url}`);

    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set JSON content type if we're not sending FormData
    if (!(config.data instanceof FormData) && config.headers) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    console.error("[v0] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("[v0] API response received:", response.status, response.statusText)
    return response
  },
  (error) => {
    console.error("[v0] API response error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    })

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
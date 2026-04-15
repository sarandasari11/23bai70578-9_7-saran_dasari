import axios from "axios";
import { getAuthHeader } from "./auth";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();

  if (authHeader) {
    config.headers.Authorization = authHeader;
  }

  return config;
});

export default api;
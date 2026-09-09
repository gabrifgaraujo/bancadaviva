import axios from "axios";

// Wrapper único de fetch/axios — adiciona o Bearer token automaticamente
// e centraliza a URL base. Nenhum service faz axios.create() por conta própria.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@bancadaviva:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("@bancadaviva:token");
      localStorage.removeItem("@bancadaviva:user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

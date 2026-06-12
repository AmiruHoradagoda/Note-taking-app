import { apiFetch } from "../../lib/apiClient";

export const login = (credentials) => apiFetch("/auth/login", {
  method: "POST",
  body: credentials,
});

export const register = (payload) => apiFetch("/auth/register", {
  method: "POST",
  body: payload,
});

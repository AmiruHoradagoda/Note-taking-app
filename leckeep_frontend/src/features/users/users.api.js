import { apiFetch } from "../../lib/apiClient";

const unwrap = (response) => response?.data ?? response;

export const getUsers = async () => unwrap(await apiFetch("/users/getAllUsers"));

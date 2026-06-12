import { apiFetch } from "../../lib/apiClient";

const unwrap = (response) => response?.data ?? response;

export const getSubjects = async () => unwrap(await apiFetch("/subjects"));

export const createSubject = async (payload) =>
  unwrap(await apiFetch("/subjects", {
    method: "POST",
    body: payload,
  }));

export const updateSubject = async (id, payload) =>
  unwrap(await apiFetch(`/subjects/${id}`, {
    method: "PUT",
    body: payload,
  }));

export const deleteSubject = async (id) =>
  unwrap(await apiFetch(`/subjects/${id}`, {
    method: "DELETE",
  }));

import { apiFetch, buildApiUrl } from "../../lib/apiClient";

const unwrap = (response) => response?.data ?? response;

export const getFolderDocuments = async (folderId, { page = 0, size = 100 } = {}) =>
  unwrap(await apiFetch(`/folders/${folderId}/documents`, { params: { page, size } }));

export const uploadDocument = async (folderId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return unwrap(await apiFetch(`/folders/${folderId}/documents`, {
    method: "POST",
    body: formData,
  }));
};

export const previewDocument = async (documentId) =>
  unwrap(await apiFetch(`/documents/${documentId}/preview`));

export const deleteDocument = async (documentId) =>
  unwrap(await apiFetch(`/documents/${documentId}`, {
    method: "DELETE",
  }));

export const getDocumentDownloadUrl = (documentId) =>
  buildApiUrl(`/documents/${documentId}/download`);

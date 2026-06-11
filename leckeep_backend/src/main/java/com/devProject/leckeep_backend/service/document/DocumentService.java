package com.devProject.leckeep_backend.service.document;

public interface DocumentService {
    String uploadDocument(String folderId);

    String getFolderDocuments(String folderId);

    String downloadDocument(String documentId);

    String previewDocument(String documentId);

    String deleteDocument(String documentId);
}

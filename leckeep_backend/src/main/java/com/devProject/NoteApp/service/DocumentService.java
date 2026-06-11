package com.devProject.NoteApp.service;

public interface DocumentService {
    String uploadDocument(String folderId);

    String getFolderDocuments(String folderId);

    String downloadDocument(String documentId);

    String previewDocument(String documentId);

    String deleteDocument(String documentId);
}

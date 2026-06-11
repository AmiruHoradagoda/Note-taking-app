package com.devProject.NoteApp.service.impl;

import com.devProject.NoteApp.service.DocumentService;
import org.springframework.stereotype.Service;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Override
    public String uploadDocument(String folderId) {
        return "POST document for folder " + folderId;
    }

    @Override
    public String getFolderDocuments(String folderId) {
        return "GET documents for folder " + folderId;
    }

    @Override
    public String downloadDocument(String documentId) {
        return "GET document download " + documentId;
    }

    @Override
    public String previewDocument(String documentId) {
        return "GET document preview " + documentId;
    }

    @Override
    public String deleteDocument(String documentId) {
        return "DELETE document " + documentId;
    }
}

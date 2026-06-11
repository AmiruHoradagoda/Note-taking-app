package com.devProject.leckeep_backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devProject.leckeep_backend.service.document.DocumentService;
import com.devProject.leckeep_backend.utils.StandardResponseDto;

@RestController
@RequestMapping("/api/v1")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/folders/{folderId}/documents")
    public StandardResponseDto uploadDocument(@PathVariable String folderId) {
        return new StandardResponseDto(200, "Document upload action completed", documentService.uploadDocument(folderId));
    }

    @GetMapping("/folders/{folderId}/documents")
    public StandardResponseDto getFolderDocuments(@PathVariable String folderId) {
        return new StandardResponseDto(200, "Folder documents fetched", documentService.getFolderDocuments(folderId));
    }

    @GetMapping("/documents/{documentId}/download")
    public StandardResponseDto downloadDocument(@PathVariable String documentId) {
        return new StandardResponseDto(200, "Document download action completed", documentService.downloadDocument(documentId));
    }

    @GetMapping("/documents/{documentId}/preview")
    public StandardResponseDto previewDocument(@PathVariable String documentId) {
        return new StandardResponseDto(200, "Document preview action completed", documentService.previewDocument(documentId));
    }

    @DeleteMapping("/documents/{documentId}")
    public StandardResponseDto deleteDocument(@PathVariable String documentId) {
        return new StandardResponseDto(200, "Document deleted", documentService.deleteDocument(documentId));
    }
}

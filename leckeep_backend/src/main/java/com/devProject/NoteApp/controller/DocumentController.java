package com.devProject.NoteApp.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class DocumentController {

    @PostMapping("/folders/{folderId}/documents")
    public String uploadDocument(@PathVariable String folderId) {
        return "POST document for folder " + folderId;
    }

    @GetMapping("/folders/{folderId}/documents")
    public String getFolderDocuments(@PathVariable String folderId) {
        return "GET documents for folder " + folderId;
    }

    @GetMapping("/documents/{documentId}/download")
    public String downloadDocument(@PathVariable String documentId) {
        return "GET document download " + documentId;
    }

    @GetMapping("/documents/{documentId}/preview")
    public String previewDocument(@PathVariable String documentId) {
        return "GET document preview " + documentId;
    }

    @DeleteMapping("/documents/{documentId}")
    public String deleteDocument(@PathVariable String documentId) {
        return "DELETE document " + documentId;
    }
}

package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.utils.StandardResponseDto;
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
    public StandardResponseDto uploadDocument(@PathVariable String folderId) {
        return new StandardResponseDto(200, "Document upload action completed", "POST document for folder " + folderId);
    }

    @GetMapping("/folders/{folderId}/documents")
    public StandardResponseDto getFolderDocuments(@PathVariable String folderId) {
        return new StandardResponseDto(200, "Folder documents fetched", "GET documents for folder " + folderId);
    }

    @GetMapping("/documents/{documentId}/download")
    public StandardResponseDto downloadDocument(@PathVariable String documentId) {
        return new StandardResponseDto(200, "Document download action completed", "GET document download " + documentId);
    }

    @GetMapping("/documents/{documentId}/preview")
    public StandardResponseDto previewDocument(@PathVariable String documentId) {
        return new StandardResponseDto(200, "Document preview action completed", "GET document preview " + documentId);
    }

    @DeleteMapping("/documents/{documentId}")
    public StandardResponseDto deleteDocument(@PathVariable String documentId) {
        return new StandardResponseDto(200, "Document deleted", "DELETE document " + documentId);
    }
}

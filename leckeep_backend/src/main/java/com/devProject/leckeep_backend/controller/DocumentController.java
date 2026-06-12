package com.devProject.leckeep_backend.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.devProject.leckeep_backend.dto.response.DocumentDownloadResponseDto;
import com.devProject.leckeep_backend.service.document.DocumentService;
import com.devProject.leckeep_backend.utils.StandardResponseDto;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v1")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/folders/{folderId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StandardResponseDto uploadDocument(
            @PathVariable String folderId,
            @RequestParam("file") MultipartFile file
    ) {
        return new StandardResponseDto(200, "Document uploaded", documentService.uploadDocument(folderId, file));
    }

    @GetMapping("/folders/{folderId}/documents")
    public StandardResponseDto getFolderDocuments(
            @PathVariable String folderId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        return new StandardResponseDto(200, "Folder documents fetched", documentService.getFolderDocuments(folderId, page, size));
    }

    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<InputStreamResource> downloadDocument(@PathVariable String documentId) {
        DocumentDownloadResponseDto download = documentService.downloadDocument(documentId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(download.getContentType()))
                .contentLength(download.getSizeBytes())
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(download.getOriginalName(), StandardCharsets.UTF_8)
                                .build()
                                .toString()
                )
                .body(new InputStreamResource(download.getInputStream()));
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

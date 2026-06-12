package com.devProject.leckeep_backend.service.document;

import com.devProject.leckeep_backend.dto.response.DocumentFileResponseDto;
import com.devProject.leckeep_backend.dto.response.DocumentPreviewResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {
    DocumentFileResponseDto uploadDocument(String folderId, MultipartFile file);

    String getFolderDocuments(String folderId);

    String downloadDocument(String documentId);

    DocumentPreviewResponseDto previewDocument(String documentId);

    String deleteDocument(String documentId);
}

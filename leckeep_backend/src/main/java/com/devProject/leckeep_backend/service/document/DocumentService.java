package com.devProject.leckeep_backend.service.document;

import com.devProject.leckeep_backend.dto.response.DocumentDownloadResponseDto;
import com.devProject.leckeep_backend.dto.response.DocumentFileResponseDto;
import com.devProject.leckeep_backend.dto.response.DocumentPreviewResponseDto;
import com.devProject.leckeep_backend.dto.response.pagination.DocumentFilePaginateResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {
    DocumentFileResponseDto uploadDocument(String folderId, MultipartFile file);

    DocumentFilePaginateResponseDto getFolderDocuments(String folderId, int page, int size);

    DocumentDownloadResponseDto downloadDocument(String documentId);

    DocumentPreviewResponseDto previewDocument(String documentId);

    String deleteDocument(String documentId);
}

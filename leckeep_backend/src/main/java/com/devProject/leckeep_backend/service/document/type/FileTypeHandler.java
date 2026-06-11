package com.devProject.leckeep_backend.service.document.type;

import com.devProject.leckeep_backend.enums.DocumentType;
import com.devProject.leckeep_backend.enums.PreviewMode;
import org.springframework.web.multipart.MultipartFile;

public interface FileTypeHandler {
    boolean supports(String contentType, String extension);

    void validate(MultipartFile file, String extension);

    DocumentType getDocumentType(String extension);

    PreviewMode getPreviewMode(String extension);
}

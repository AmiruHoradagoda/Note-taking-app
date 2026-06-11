package com.devProject.leckeep_backend.service.document.type;

import com.devProject.leckeep_backend.enums.DocumentType;
import com.devProject.leckeep_backend.enums.PreviewMode;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class ImageFileTypeHandler implements FileTypeHandler {
    private static final Set<String> IMAGE_EXTENSIONS = Set.of("png", "jpg", "jpeg");

    @Override
    public boolean supports(String contentType, String extension) {
        return IMAGE_EXTENSIONS.contains(extension)
                || (contentType != null && contentType.toLowerCase().startsWith("image/"));
    }

    @Override
    public void validate(MultipartFile file, String extension) {
        if (!IMAGE_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Unsupported image extension: " + extension);
        }
    }

    @Override
    public DocumentType getDocumentType(String extension) {
        return DocumentType.IMAGE;
    }

    @Override
    public PreviewMode getPreviewMode(String extension) {
        return PreviewMode.INLINE_IMAGE;
    }
}

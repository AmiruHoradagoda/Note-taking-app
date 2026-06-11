package com.devProject.leckeep_backend.service.document;

import com.devProject.leckeep_backend.enums.DocumentType;
import com.devProject.leckeep_backend.enums.PreviewMode;
import com.devProject.leckeep_backend.service.document.type.FileTypeHandler;
import com.devProject.leckeep_backend.service.document.type.FileTypeHandlerResolver;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class FileValidationService {
    private static final long MAX_FILE_SIZE_BYTES = 25L * 1024L * 1024L;
    private final FileTypeHandlerResolver fileTypeHandlerResolver;

    public FileValidationResult validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size must not exceed 25 MB");
        }

        String extension = getExtension(file.getOriginalFilename());
        FileTypeHandler handler = fileTypeHandlerResolver.resolve(file.getContentType(), extension);
        handler.validate(file, extension);

        return FileValidationResult.builder()
                .extension(extension)
                .safeFilename(getSafeFilename(file.getOriginalFilename()))
                .documentType(handler.getDocumentType(extension))
                .previewMode(handler.getPreviewMode(extension))
                .build();
    }

    public String getExtension(String originalFilename) {
        String filename = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            throw new IllegalArgumentException("File extension is required");
        }
        return filename.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
    }

    public String getSafeFilename(String originalFilename) {
        String filename = StringUtils.cleanPath(originalFilename == null ? "file" : originalFilename);
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    @Getter
    @Builder
    public static class FileValidationResult {
        private final String extension;
        private final String safeFilename;
        private final DocumentType documentType;
        private final PreviewMode previewMode;
    }
}

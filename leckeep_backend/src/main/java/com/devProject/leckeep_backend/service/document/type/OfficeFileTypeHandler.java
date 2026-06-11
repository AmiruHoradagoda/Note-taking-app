package com.devProject.leckeep_backend.service.document.type;

import com.devProject.leckeep_backend.enums.DocumentType;
import com.devProject.leckeep_backend.enums.PreviewMode;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class OfficeFileTypeHandler implements FileTypeHandler {
    private static final Set<String> WORD_EXTENSIONS = Set.of("doc", "docx");
    private static final Set<String> EXCEL_EXTENSIONS = Set.of("xls", "xlsx");
    private static final Set<String> POWERPOINT_EXTENSIONS = Set.of("ppt", "pptx");

    @Override
    public boolean supports(String contentType, String extension) {
        return WORD_EXTENSIONS.contains(extension)
                || EXCEL_EXTENSIONS.contains(extension)
                || POWERPOINT_EXTENSIONS.contains(extension);
    }

    @Override
    public void validate(MultipartFile file, String extension) {
        if (!supports(file.getContentType(), extension)) {
            throw new IllegalArgumentException("Unsupported office document extension: " + extension);
        }
    }

    @Override
    public DocumentType getDocumentType(String extension) {
        if (WORD_EXTENSIONS.contains(extension)) {
            return DocumentType.WORD;
        }
        if (EXCEL_EXTENSIONS.contains(extension)) {
            return DocumentType.EXCEL;
        }
        return DocumentType.POWERPOINT;
    }

    @Override
    public PreviewMode getPreviewMode(String extension) {
        return PreviewMode.DOWNLOAD_ONLY;
    }
}

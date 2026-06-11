package com.devProject.leckeep_backend.service.document.type;

import com.devProject.leckeep_backend.enums.DocumentType;
import com.devProject.leckeep_backend.enums.PreviewMode;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class PdfFileTypeHandler implements FileTypeHandler {
    private static final String PDF_EXTENSION = "pdf";
    private static final String PDF_CONTENT_TYPE = "application/pdf";

    @Override
    public boolean supports(String contentType, String extension) {
        return PDF_EXTENSION.equals(extension) || PDF_CONTENT_TYPE.equalsIgnoreCase(contentType);
    }

    @Override
    public void validate(MultipartFile file, String extension) {
        if (!PDF_EXTENSION.equals(extension)) {
            throw new IllegalArgumentException("PDF file must use .pdf extension");
        }
    }

    @Override
    public DocumentType getDocumentType(String extension) {
        return DocumentType.PDF;
    }

    @Override
    public PreviewMode getPreviewMode(String extension) {
        return PreviewMode.INLINE_PDF;
    }
}

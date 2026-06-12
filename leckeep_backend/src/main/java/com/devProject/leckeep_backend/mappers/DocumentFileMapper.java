package com.devProject.leckeep_backend.mappers;

import com.devProject.leckeep_backend.dto.response.DocumentFileResponseDto;
import com.devProject.leckeep_backend.model.DocumentFile;
import com.devProject.leckeep_backend.service.document.FileValidationService;
import com.devProject.leckeep_backend.service.document.type.FileTypeHandler;
import com.devProject.leckeep_backend.service.document.type.FileTypeHandlerResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocumentFileMapper {
    private final FileTypeHandlerResolver fileTypeHandlerResolver;

    public DocumentFileResponseDto toDocumentFileResponseDto(
            DocumentFile documentFile,
            FileValidationService.FileValidationResult validationResult
    ) {
        if (documentFile == null) {
            return null;
        }

        return DocumentFileResponseDto.builder()
                .id(documentFile.getId())
                .folderId(documentFile.getFolderId())
                .ownerId(documentFile.getOwnerId())
                .originalName(documentFile.getOriginalName())
                .contentType(documentFile.getContentType())
                .extension(documentFile.getExtension())
                .sizeBytes(documentFile.getSizeBytes())
                .checksum(documentFile.getChecksum())
                .documentType(validationResult.getDocumentType())
                .previewMode(validationResult.getPreviewMode())
                .createdAt(documentFile.getCreatedAt())
                .updatedAt(documentFile.getUpdatedAt())
                .build();
    }

    public DocumentFileResponseDto toDocumentFileResponseDto(DocumentFile documentFile) {
        if (documentFile == null) {
            return null;
        }

        FileTypeHandler fileTypeHandler = fileTypeHandlerResolver.resolve(
                documentFile.getContentType(),
                documentFile.getExtension()
        );
        return DocumentFileResponseDto.builder()
                .id(documentFile.getId())
                .folderId(documentFile.getFolderId())
                .ownerId(documentFile.getOwnerId())
                .originalName(documentFile.getOriginalName())
                .contentType(documentFile.getContentType())
                .extension(documentFile.getExtension())
                .sizeBytes(documentFile.getSizeBytes())
                .checksum(documentFile.getChecksum())
                .documentType(fileTypeHandler.getDocumentType(documentFile.getExtension()))
                .previewMode(fileTypeHandler.getPreviewMode(documentFile.getExtension()))
                .createdAt(documentFile.getCreatedAt())
                .updatedAt(documentFile.getUpdatedAt())
                .build();
    }
}

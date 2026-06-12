package com.devProject.leckeep_backend.dto.response;

import com.devProject.leckeep_backend.enums.DocumentType;
import com.devProject.leckeep_backend.enums.PreviewMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentFileResponseDto {
    private String id;
    private String folderId;
    private String ownerId;
    private String originalName;
    private String contentType;
    private String extension;
    private long sizeBytes;
    private String checksum;
    private DocumentType documentType;
    private PreviewMode previewMode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

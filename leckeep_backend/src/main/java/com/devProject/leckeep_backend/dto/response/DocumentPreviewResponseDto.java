package com.devProject.leckeep_backend.dto.response;

import com.devProject.leckeep_backend.enums.PreviewMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentPreviewResponseDto {
    private String documentId;
    private String originalName;
    private String contentType;
    private String extension;
    private long sizeBytes;
    private PreviewMode previewMode;
    private String previewUrl;
    private boolean inlinePreview;
}

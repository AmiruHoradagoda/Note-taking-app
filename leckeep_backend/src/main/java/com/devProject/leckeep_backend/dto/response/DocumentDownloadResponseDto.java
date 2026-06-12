package com.devProject.leckeep_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.InputStream;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentDownloadResponseDto {
    private String documentId;
    private String originalName;
    private String contentType;
    private long sizeBytes;
    private InputStream inputStream;
}

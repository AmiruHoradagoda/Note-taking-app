package com.devProject.leckeep_backend.service.document.storage;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoredObject {
    private final String bucketName;
    private final String objectKey;
    private final String originalName;
    private final String contentType;
    private final long sizeBytes;
}

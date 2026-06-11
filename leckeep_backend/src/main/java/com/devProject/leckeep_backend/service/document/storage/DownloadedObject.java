package com.devProject.leckeep_backend.service.document.storage;

import lombok.Builder;
import lombok.Getter;

import java.io.InputStream;

@Getter
@Builder
public class DownloadedObject {
    private final String objectKey;
    private final String contentType;
    private final long sizeBytes;
    private final InputStream inputStream;
}

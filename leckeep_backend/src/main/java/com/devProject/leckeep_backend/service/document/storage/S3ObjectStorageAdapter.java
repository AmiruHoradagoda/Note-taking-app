package com.devProject.leckeep_backend.service.document.storage;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

//Apply this for future cases,if this become globe
@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "s3")
public class S3ObjectStorageAdapter implements ObjectStorageService{
    @Override
    public StoredObject upload(FileUploadCommand command) {
        throw new UnsupportedOperationException("S3 storage adapter is not implemented yet");
    }

    @Override
    public DownloadedObject download(String objectKey) {
        throw new UnsupportedOperationException("S3 storage adapter is not implemented yet");
    }

    @Override
    public void delete(String objectKey) {
        throw new UnsupportedOperationException("S3 storage adapter is not implemented yet");
    }

    @Override
    public String generatePreviewUrl(String objectKey) {
        throw new UnsupportedOperationException("S3 storage adapter is not implemented yet");
    }
}

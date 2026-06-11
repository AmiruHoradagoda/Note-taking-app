package com.devProject.leckeep_backend.service.document.storage;

public interface ObjectStorageService {
    StoredObject upload(FileUploadCommand command);
    DownloadedObject download(String objectKey);
    void delete(String objectKey);
    String generatePreviewUrl(String objectKey);
}

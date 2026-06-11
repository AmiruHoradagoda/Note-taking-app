package com.devProject.NoteApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "documents")
public class DocumentFile {
    @Id
    private String id;
    @Indexed
    private String folderId;
    @Indexed
    private String ownerId;
    private String originalName;
    private String storedKey;
    private String contentType;
    private String extension;
    private long sizeBytes;
    private String checksum;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}

package com.devProject.leckeep_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}

package com.devProject.leckeep_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.devProject.leckeep_backend.enums.FolderVisibility;

import java.time.LocalDateTime;

@Data
@Document(collection = "note_folders")
public class NoteFolder {
    @Id
    private String id;
    @Indexed
    private String ownerId;
    private String title;
    private String description;
    @Indexed
    private String subjectId;
    private String semester;
    private String category;
    @Indexed
    private FolderVisibility visibility = FolderVisibility.PRIVATE;
    @Indexed
    private String groupId;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}

package com.devProject.leckeep_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.devProject.leckeep_backend.enums.FolderCategory;
import com.devProject.leckeep_backend.enums.FolderVisibility;

import java.time.LocalDateTime;

@Data
@Document(collection = "note_folders")
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private FolderCategory category;
    @Indexed
    @Builder.Default
    private FolderVisibility visibility = FolderVisibility.PRIVATE;
    @Indexed
    private String groupId;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}

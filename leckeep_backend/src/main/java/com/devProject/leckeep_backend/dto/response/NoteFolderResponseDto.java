package com.devProject.leckeep_backend.dto.response;
import lombok.*;

import java.time.LocalDateTime;

import com.devProject.leckeep_backend.enums.FolderCategory;
import com.devProject.leckeep_backend.enums.FolderVisibility;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteFolderResponseDto {
    private String id;
    private String ownerId;
    private String title;
    private String description;
    private String subjectId;
    private String semester;
    private FolderCategory category;
    private FolderVisibility visibility;
    private String groupId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

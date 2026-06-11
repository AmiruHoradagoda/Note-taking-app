package com.devProject.NoteApp.dto.response;
import com.devProject.NoteApp.enums.FolderVisibility;
import lombok.*;

import java.time.LocalDateTime;

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
    private String category;
    private FolderVisibility visibility;
    private String groupId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

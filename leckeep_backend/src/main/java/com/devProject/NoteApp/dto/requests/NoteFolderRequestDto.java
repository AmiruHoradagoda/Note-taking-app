package com.devProject.NoteApp.dto.requests;

import com.devProject.NoteApp.enums.FolderVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteFolderRequestDto {
    private String title;
    private String description;
    private String subjectId;
    private String semester;
    private String category;
    private FolderVisibility visibility;
    private String groupId;
}

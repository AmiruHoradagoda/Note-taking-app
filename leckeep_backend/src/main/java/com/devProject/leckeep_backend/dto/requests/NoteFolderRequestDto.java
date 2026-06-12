package com.devProject.leckeep_backend.dto.requests;

import com.devProject.leckeep_backend.enums.FolderCategory;
import com.devProject.leckeep_backend.enums.FolderVisibility;

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
    private FolderCategory category;
    private FolderVisibility visibility;
    private String groupId;
}

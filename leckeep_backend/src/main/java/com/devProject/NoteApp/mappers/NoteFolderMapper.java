package com.devProject.NoteApp.mappers;

import com.devProject.NoteApp.dto.response.NoteFolderResponseDto;
import com.devProject.NoteApp.model.NoteFolder;
import org.springframework.stereotype.Component;

@Component
public class NoteFolderMapper {
    public NoteFolderResponseDto toNoteFolderResponseDto(NoteFolder noteFolder) {
        if (noteFolder == null) {
            return null;
        }

        return NoteFolderResponseDto.builder()
                .id(noteFolder.getId())
                .ownerId(noteFolder.getOwnerId())
                .title(noteFolder.getTitle())
                .description(noteFolder.getDescription())
                .subjectId(noteFolder.getSubjectId())
                .semester(noteFolder.getSemester())
                .category(noteFolder.getCategory())
                .visibility(noteFolder.getVisibility())
                .groupId(noteFolder.getGroupId())
                .createdAt(noteFolder.getCreatedAt())
                .updatedAt(noteFolder.getUpdatedAt())
                .build();
    }
}

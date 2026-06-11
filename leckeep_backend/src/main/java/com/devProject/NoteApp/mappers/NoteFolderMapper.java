package com.devProject.NoteApp.mappers;

import com.devProject.NoteApp.dto.requests.NoteFolderRequestDto;
import com.devProject.NoteApp.dto.response.NoteFolderResponseDto;
import com.devProject.NoteApp.enums.FolderVisibility;
import com.devProject.NoteApp.model.NoteFolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

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

    public NoteFolder toNoteFolder(NoteFolderRequestDto request, String ownerId) {
        if (request == null) {
            return null;
        }

        NoteFolder noteFolder = new NoteFolder();
        noteFolder.setOwnerId(ownerId);
        noteFolder.setTitle(request.getTitle());
        noteFolder.setDescription(request.getDescription());
        noteFolder.setSubjectId(request.getSubjectId());
        noteFolder.setSemester(request.getSemester());
        noteFolder.setCategory(request.getCategory());
        noteFolder.setVisibility(resolveVisibility(request.getVisibility()));
        noteFolder.setGroupId(resolveGroupId(request));
        noteFolder.setCreatedAt(LocalDateTime.now());
        noteFolder.setUpdatedAt(LocalDateTime.now());
        return noteFolder;
    }

    public void updateNoteFolder(NoteFolder noteFolder, NoteFolderRequestDto request) {
        if (noteFolder == null || request == null) {
            return;
        }

        noteFolder.setTitle(request.getTitle());
        noteFolder.setDescription(request.getDescription());
        noteFolder.setSubjectId(request.getSubjectId());
        noteFolder.setSemester(request.getSemester());
        noteFolder.setCategory(request.getCategory());
        noteFolder.setVisibility(resolveVisibility(request.getVisibility()));
        noteFolder.setGroupId(resolveGroupId(request));
        noteFolder.setUpdatedAt(LocalDateTime.now());
    }

    private FolderVisibility resolveVisibility(FolderVisibility visibility) {
        return visibility != null ? visibility : FolderVisibility.PRIVATE;
    }

    private String resolveGroupId(NoteFolderRequestDto request) {
        return request.getVisibility() == FolderVisibility.GROUP ? request.getGroupId() : null;
    }
}

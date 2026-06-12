package com.devProject.leckeep_backend.mappers;

import org.springframework.stereotype.Component;

import com.devProject.leckeep_backend.dto.requests.NoteFolderRequestDto;
import com.devProject.leckeep_backend.dto.response.NoteFolderResponseDto;
import com.devProject.leckeep_backend.enums.FolderVisibility;
import com.devProject.leckeep_backend.model.NoteFolder;
import com.devProject.leckeep_backend.utils.SemesterUtils;

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
        noteFolder.setSemester(SemesterUtils.normalizeSemester(request.getSemester()));
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
        noteFolder.setSemester(SemesterUtils.normalizeSemester(request.getSemester()));
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

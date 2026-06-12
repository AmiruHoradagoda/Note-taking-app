package com.devProject.leckeep_backend.mappers;

import com.devProject.leckeep_backend.dto.requests.StudyGroupRequestDto;
import com.devProject.leckeep_backend.dto.response.StudyGroupResponseDto;
import com.devProject.leckeep_backend.model.StudyGroup;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class StudyGroupMapper {
    public StudyGroupResponseDto toStudyGroupResponseDto(StudyGroup studyGroup) {
        if (studyGroup == null) {
            return null;
        }

        return StudyGroupResponseDto.builder()
                .id(studyGroup.getId())
                .name(studyGroup.getName())
                .ownerId(studyGroup.getOwnerId())
                .createdAt(studyGroup.getCreatedAt())
                .updatedAt(studyGroup.getUpdatedAt())
                .build();
    }

    public StudyGroup toStudyGroup(StudyGroupRequestDto request, String ownerId) {
        if (request == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        return StudyGroup.builder()
                .name(request.getName().trim())
                .ownerId(ownerId)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    public void updateStudyGroup(StudyGroup studyGroup, StudyGroupRequestDto request) {
        if (studyGroup == null || request == null) {
            return;
        }

        studyGroup.setName(request.getName().trim());
        studyGroup.setUpdatedAt(LocalDateTime.now());
    }
}

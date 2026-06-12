package com.devProject.leckeep_backend.mappers;

import com.devProject.leckeep_backend.dto.requests.SubjectRequestDto;
import com.devProject.leckeep_backend.dto.response.SubjectResponseDto;
import com.devProject.leckeep_backend.model.Subject;
import com.devProject.leckeep_backend.utils.SemesterUtils;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SubjectMapper {
    public SubjectResponseDto toSubjectResponseDto(Subject subject) {
        if (subject == null) {
            return null;
        }

        return SubjectResponseDto.builder()
                .id(subject.getId())
                .ownerId(subject.getOwnerId())
                .name(subject.getName())
                .semester(subject.getSemester())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }

    public Subject toSubject(SubjectRequestDto request, String ownerId) {
        if (request == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        return Subject.builder()
                .ownerId(ownerId)
                .name(request.getName().trim())
                .semester(resolveSemester(request.getSemester()))
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    public void updateSubject(Subject subject, SubjectRequestDto request) {
        if (subject == null || request == null) {
            return;
        }

        subject.setName(request.getName().trim());
        subject.setSemester(resolveSemester(request.getSemester()));
        subject.setUpdatedAt(LocalDateTime.now());
    }

    private String resolveSemester(String semester) {
        return SemesterUtils.normalizeSemester(semester);
    }
}

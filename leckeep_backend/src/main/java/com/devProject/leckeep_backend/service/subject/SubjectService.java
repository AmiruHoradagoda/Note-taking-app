package com.devProject.leckeep_backend.service.subject;

import com.devProject.leckeep_backend.dto.requests.SubjectRequestDto;
import com.devProject.leckeep_backend.dto.response.SubjectResponseDto;

import java.util.List;

public interface SubjectService {
    List<SubjectResponseDto> getSubjects();

    SubjectResponseDto createSubject(SubjectRequestDto request);

    SubjectResponseDto updateSubject(String id, SubjectRequestDto request);

    void deleteSubject(String id);
}

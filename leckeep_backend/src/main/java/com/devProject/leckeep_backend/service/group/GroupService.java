package com.devProject.leckeep_backend.service.group;

import com.devProject.leckeep_backend.dto.requests.StudyGroupRequestDto;
import com.devProject.leckeep_backend.dto.response.StudyGroupResponseDto;
import com.devProject.leckeep_backend.dto.response.pagination.StudyGroupPaginateResponseDto;

public interface GroupService {
    StudyGroupPaginateResponseDto getGroups(int page, int size);

    StudyGroupResponseDto createGroup(StudyGroupRequestDto request);

    StudyGroupResponseDto getGroupById(String id);

    StudyGroupResponseDto updateGroup(String id, StudyGroupRequestDto request);

    void deleteGroup(String id);
}

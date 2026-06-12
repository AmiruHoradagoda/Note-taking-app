package com.devProject.leckeep_backend.service.group;

import com.devProject.leckeep_backend.dto.requests.StudyGroupRequestDto;
import com.devProject.leckeep_backend.dto.response.StudyGroupResponseDto;
import com.devProject.leckeep_backend.dto.response.pagination.StudyGroupPaginateResponseDto;
import com.devProject.leckeep_backend.enums.GroupRole;
import com.devProject.leckeep_backend.mappers.StudyGroupMapper;
import com.devProject.leckeep_backend.model.GroupMember;
import com.devProject.leckeep_backend.model.StudyGroup;
import com.devProject.leckeep_backend.repository.GroupMemberRepository;
import com.devProject.leckeep_backend.repository.StudyGroupRepository;
import com.devProject.leckeep_backend.service.auth.CurrentUserService;
import com.devProject.leckeep_backend.utils.PaginationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {
    private static final int MAX_PAGE_SIZE = 100;

    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final StudyGroupMapper studyGroupMapper;
    private final CurrentUserService currentUserService;

    @Override
    public StudyGroupPaginateResponseDto getGroups(int page, int size) {
        Pageable pageable = PaginationUtils.buildPageable(
                page,
                size,
                MAX_PAGE_SIZE,
                Sort.by(Sort.Direction.DESC, "updatedAt", "createdAt")
        );
        Page<StudyGroup> groupPage = studyGroupRepository.findByOwnerId(
                currentUserService.requireCurrentUserId(),
                pageable
        );

        return StudyGroupPaginateResponseDto.builder()
                .dataList(groupPage.getContent()
                        .stream()
                        .map(studyGroupMapper::toStudyGroupResponseDto)
                        .toList())
                .dataCount(groupPage.getTotalElements())
                .build();
    }

    @Override
    public StudyGroupResponseDto createGroup(StudyGroupRequestDto request) {
        validateGroupRequest(request);

        String currentUserId = currentUserService.requireCurrentUserId();
        StudyGroup studyGroup = studyGroupMapper.toStudyGroup(request, currentUserId);
        StudyGroup savedGroup = studyGroupRepository.save(studyGroup);

        groupMemberRepository.save(GroupMember.builder()
                .groupId(savedGroup.getId())
                .userId(currentUserId)
                .role(GroupRole.ADMIN)
                .build());

        return studyGroupMapper.toStudyGroupResponseDto(savedGroup);
    }

    @Override
    public StudyGroupResponseDto getGroupById(String id) {
        StudyGroup studyGroup = findGroupOrThrow(id);
        requireGroupOwner(studyGroup);
        return studyGroupMapper.toStudyGroupResponseDto(studyGroup);
    }

    @Override
    public StudyGroupResponseDto updateGroup(String id, StudyGroupRequestDto request) {
        validateGroupRequest(request);

        StudyGroup studyGroup = findGroupOrThrow(id);
        requireGroupOwner(studyGroup);
        studyGroupMapper.updateStudyGroup(studyGroup, request);

        StudyGroup updatedGroup = studyGroupRepository.save(studyGroup);
        return studyGroupMapper.toStudyGroupResponseDto(updatedGroup);
    }

    @Override
    public void deleteGroup(String id) {
        StudyGroup studyGroup = findGroupOrThrow(id);
        requireGroupOwner(studyGroup);
        groupMemberRepository.deleteByGroupId(id);
        studyGroupRepository.delete(studyGroup);
    }

    private StudyGroup findGroupOrThrow(String id) {
        return studyGroupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + id));
    }

    private void validateGroupRequest(StudyGroupRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Group request is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Group name is required");
        }
    }

    private void requireGroupOwner(StudyGroup studyGroup) {
        String currentUserId = currentUserService.requireCurrentUserId();
        if (!currentUserId.equals(studyGroup.getOwnerId())) {
            throw new SecurityException("You do not have access to this group");
        }
    }
}

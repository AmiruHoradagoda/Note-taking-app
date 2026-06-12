package com.devProject.leckeep_backend.mappers;

import com.devProject.leckeep_backend.dto.response.GroupMemberResponseDto;
import com.devProject.leckeep_backend.model.GroupMember;
import org.springframework.stereotype.Component;

@Component
public class GroupMemberMapper {
    public GroupMemberResponseDto toGroupMemberResponseDto(GroupMember groupMember) {
        if (groupMember == null) {
            return null;
        }

        return GroupMemberResponseDto.builder()
                .id(groupMember.getId())
                .groupId(groupMember.getGroupId())
                .userId(groupMember.getUserId())
                .role(groupMember.getRole())
                .createdAt(groupMember.getCreatedAt())
                .build();
    }
}

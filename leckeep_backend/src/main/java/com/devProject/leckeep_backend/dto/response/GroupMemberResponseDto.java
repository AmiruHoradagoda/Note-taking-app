package com.devProject.leckeep_backend.dto.response;

import com.devProject.leckeep_backend.enums.GroupRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupMemberResponseDto {
    private String id;
    private String groupId;
    private String userId;
    private GroupRole role;
    private LocalDateTime createdAt;
}

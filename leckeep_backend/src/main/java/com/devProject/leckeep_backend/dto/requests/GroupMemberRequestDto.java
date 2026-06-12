package com.devProject.leckeep_backend.dto.requests;

import com.devProject.leckeep_backend.enums.GroupRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberRequestDto {
    private String userId;
    private GroupRole role;
}

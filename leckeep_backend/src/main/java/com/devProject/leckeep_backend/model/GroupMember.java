package com.devProject.leckeep_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.devProject.leckeep_backend.enums.GroupRole;

import java.time.LocalDateTime;

@Data
@Document(collection = "group_members")
@CompoundIndex(name = "group_member_unique", def = "{'groupId': 1, 'userId': 1}", unique = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMember {
    @Id
    private String id;
    @Indexed
    private String groupId;
    @Indexed
    private String userId;
    @Builder.Default
    private GroupRole role = GroupRole.MEMBER;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

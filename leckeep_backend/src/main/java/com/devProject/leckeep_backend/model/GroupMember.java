package com.devProject.leckeep_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.devProject.leckeep_backend.enums.GroupRole;

import java.time.LocalDateTime;

@Data
@Document(collection = "group_members")
@CompoundIndex(name = "group_member_unique", def = "{'groupId': 1, 'userId': 1}", unique = true)
public class GroupMember {
    @Id
    private String id;
    @Indexed
    private String groupId;
    @Indexed
    private String userId;
    private GroupRole role = GroupRole.MEMBER;
    private LocalDateTime createdAt = LocalDateTime.now();
}

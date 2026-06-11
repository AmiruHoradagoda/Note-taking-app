package com.devProject.NoteApp.model;

import com.devProject.NoteApp.enums.GroupRole;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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

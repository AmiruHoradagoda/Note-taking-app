package com.devProject.NoteApp.model;

import com.devProject.NoteApp.enums.SharePermission;
import com.devProject.NoteApp.enums.ShareTargetType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "folder_shares")
@CompoundIndex(name = "folder_share_unique", def = "{'folderId': 1, 'targetType': 1, 'targetId': 1}", unique = true)
public class FolderShare {
    @Id
    private String id;
    @Indexed
    private String folderId;
    @Indexed
    private String ownerId;
    private ShareTargetType targetType;
    private String targetId;
    private SharePermission permission = SharePermission.READ;
    private LocalDateTime createdAt = LocalDateTime.now();
}

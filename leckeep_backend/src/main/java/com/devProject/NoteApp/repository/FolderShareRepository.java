package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.enums.ShareTargetType;
import com.devProject.NoteApp.model.FolderShare;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderShareRepository extends MongoRepository<FolderShare, String> {
    List<FolderShare> findByFolderId(String folderId);

    List<FolderShare> findByOwnerId(String ownerId);

    List<FolderShare> findByTargetTypeAndTargetId(ShareTargetType targetType, String targetId);

    Optional<FolderShare> findByFolderIdAndTargetTypeAndTargetId(
            String folderId,
            ShareTargetType targetType,
            String targetId
    );

    boolean existsByFolderIdAndTargetTypeAndTargetId(String folderId, ShareTargetType targetType, String targetId);

    void deleteByFolderId(String folderId);
}

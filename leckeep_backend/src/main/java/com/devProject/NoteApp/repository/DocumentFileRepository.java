package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.DocumentFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentFileRepository extends MongoRepository<DocumentFile, String> {
    List<DocumentFile> findByFolderId(String folderId);

    List<DocumentFile> findByOwnerId(String ownerId);

    List<DocumentFile> findByFolderIdAndOwnerId(String folderId, String ownerId);

    List<DocumentFile> findByOriginalNameContainingIgnoreCase(String originalName);

    void deleteByFolderId(String folderId);
}

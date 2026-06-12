package com.devProject.leckeep_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devProject.leckeep_backend.model.DocumentFile;

import java.util.List;

@Repository
public interface DocumentFileRepository extends MongoRepository<DocumentFile, String> {
    List<DocumentFile> findByFolderId(String folderId);

    Page<DocumentFile> findByFolderId(String folderId, Pageable pageable);

    List<DocumentFile> findByOwnerId(String ownerId);

    List<DocumentFile> findByFolderIdAndOwnerId(String folderId, String ownerId);

    List<DocumentFile> findByOriginalNameContainingIgnoreCase(String originalName);

    void deleteByFolderId(String folderId);
}

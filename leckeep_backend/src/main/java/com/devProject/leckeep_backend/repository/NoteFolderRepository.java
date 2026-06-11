package com.devProject.leckeep_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devProject.leckeep_backend.enums.FolderVisibility;
import com.devProject.leckeep_backend.model.NoteFolder;

import java.util.Collection;
import java.util.List;

@Repository
public interface NoteFolderRepository extends MongoRepository<NoteFolder, String> {
    List<NoteFolder> findByOwnerId(String ownerId);

    Page<NoteFolder> findByOwnerId(String ownerId, Pageable pageable);

    List<NoteFolder> findByOwnerIdAndVisibility(String ownerId, FolderVisibility visibility);

    Page<NoteFolder> findByOwnerIdAndVisibility(String ownerId, FolderVisibility visibility, Pageable pageable);

    Page<NoteFolder> findByOwnerIdAndVisibilityIn(
            String ownerId,
            Collection<FolderVisibility> visibilities,
            Pageable pageable
    );

    List<NoteFolder> findByVisibility(FolderVisibility visibility);

    Page<NoteFolder> findByVisibility(FolderVisibility visibility, Pageable pageable);

    List<NoteFolder> findByGroupId(String groupId);

    List<NoteFolder> findBySubjectId(String subjectId);

    List<NoteFolder> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}

package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.enums.FolderVisibility;
import com.devProject.NoteApp.model.NoteFolder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteFolderRepository extends MongoRepository<NoteFolder, String> {
    List<NoteFolder> findByOwnerId(String ownerId);

    List<NoteFolder> findByOwnerIdAndVisibility(String ownerId, FolderVisibility visibility);

    List<NoteFolder> findByVisibility(FolderVisibility visibility);

    List<NoteFolder> findByGroupId(String groupId);

    List<NoteFolder> findBySubjectId(String subjectId);

    List<NoteFolder> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}

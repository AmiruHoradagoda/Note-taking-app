package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.StudyGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGroupRepository extends MongoRepository<StudyGroup, String> {
    List<StudyGroup> findByOwnerId(String ownerId);

    List<StudyGroup> findByNameContainingIgnoreCase(String name);
}

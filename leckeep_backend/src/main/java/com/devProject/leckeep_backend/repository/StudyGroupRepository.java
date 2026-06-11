package com.devProject.leckeep_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devProject.leckeep_backend.model.StudyGroup;

import java.util.List;

@Repository
public interface StudyGroupRepository extends MongoRepository<StudyGroup, String> {
    List<StudyGroup> findByOwnerId(String ownerId);

    List<StudyGroup> findByNameContainingIgnoreCase(String name);
}

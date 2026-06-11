package com.devProject.leckeep_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devProject.leckeep_backend.model.Subject;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByOwnerId(String ownerId);

    List<Subject> findByOwnerIdAndSemester(String ownerId, String semester);

    Optional<Subject> findByOwnerIdAndNameIgnoreCase(String ownerId, String name);

    boolean existsByOwnerIdAndNameIgnoreCase(String ownerId, String name);
}

package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<Users, String> {

    Users findByUsername(String username);

    Optional<Users> findOptionalByUsername(String username);

    boolean existsByUsername(String username);
}

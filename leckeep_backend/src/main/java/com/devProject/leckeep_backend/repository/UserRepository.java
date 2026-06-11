package com.devProject.leckeep_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devProject.leckeep_backend.model.Users;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<Users, String> {

    Users findByUsername(String username);

    Optional<Users> findOptionalByUsername(String username);

    boolean existsByUsername(String username);
}

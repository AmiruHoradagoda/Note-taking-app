package com.devProject.NoteApp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devProject.NoteApp.model.Users;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {

    Users findByUsername(String username);
}
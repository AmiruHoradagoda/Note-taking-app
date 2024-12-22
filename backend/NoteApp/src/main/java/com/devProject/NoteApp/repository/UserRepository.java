package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}

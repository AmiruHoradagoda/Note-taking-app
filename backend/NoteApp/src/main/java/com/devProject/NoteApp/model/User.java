package com.devProject.NoteApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;          // Unique ID
    private String email;       // User email
    private String password;    // Encrypted password
    private String name;        // User's full name
    private LocalDateTime createdAt = LocalDateTime.now(); // Creation timestamp
}

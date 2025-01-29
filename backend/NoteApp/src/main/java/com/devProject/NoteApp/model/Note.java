package com.devProject.NoteApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "notes")
public class Note {
    @Id
    private String id;
    private String userId;
    private String title;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();
    private List<String> tags; //madhawa
}
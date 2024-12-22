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
    private String id;              // Unique ID
    private String userId;          // User ID (foreign key)
    private String title;           // Note title
    private String content;         // Note content
    private List<String> labels;    // Labels (tags)
    private String color;           // Note color
    private boolean isArchived;     // Archived status
    private boolean isPinned;       // Pinned status
    private LocalDateTime reminder; // Reminder timestamp (optional)
    private LocalDateTime createdAt = LocalDateTime.now(); // Creation timestamp
    private LocalDateTime updatedAt = LocalDateTime.now(); // Last update timestamp
}
package com.devProject.leckeep_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "subjects")
@CompoundIndex(name = "owner_subject_unique", def = "{'ownerId': 1, 'name': 1}", unique = true)
public class Subject {
    @Id
    private String id;
    private String ownerId;
    private String name;
    private String semester;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}

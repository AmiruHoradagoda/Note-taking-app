package com.devProject.leckeep_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "subjects")
@CompoundIndex(name = "owner_subject_unique", def = "{'ownerId': 1, 'name': 1}", unique = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    @Id
    private String id;
    private String ownerId;
    private String name;
    private String semester;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}

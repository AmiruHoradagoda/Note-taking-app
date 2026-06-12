package com.devProject.leckeep_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubjectResponseDto {
    private String id;
    private String ownerId;
    private String name;
    private String semester;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

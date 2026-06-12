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
public class StudyGroupResponseDto {
    private String id;
    private String name;
    private String ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

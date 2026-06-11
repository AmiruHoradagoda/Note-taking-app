package com.devProject.NoteApp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NoteResponseDto {
    private String id;
    private String userId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private List<String> tags; //madhawa
}

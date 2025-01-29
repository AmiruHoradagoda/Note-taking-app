package com.devProject.NoteApp.dto.requests;

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
public class NoteRequestDto {
    private String userId;
    private String title;
    private String content;
    private List<String> tags; //madhawa
}

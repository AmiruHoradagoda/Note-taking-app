package com.devProject.leckeep_backend.utils;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StandardResponseDto {
    private int code;
    private String message;
    private Object data;
}
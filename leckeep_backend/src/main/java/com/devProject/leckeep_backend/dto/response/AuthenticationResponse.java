package com.devProject.leckeep_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuthenticationResponse {
    private String token;
    private String userId;
    private String username;
    private String registrationNumber;
    private String message;
}

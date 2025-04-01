package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.dto.requests.UserRequestDto;
import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.dto.response.AuthenticationResponse;
import com.devProject.NoteApp.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/")
public class AuthenticationController {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    
    private final UserService userService;

    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        logger.info("Registration request received for username: {}", request.getUsername());
        
        try {
            AuthenticationResponse response = userService.register(request);
            logger.info("User registered successfully: {}", response.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration error", e);
            return ResponseEntity.badRequest()
                .body(AuthenticationResponse.builder()
                    .message("Registration failed: " + e.getMessage())
                    .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody UserRequestDto user) {
        logger.info("Login attempt for username: {}", user.getUsername());
        
        try {
            AuthenticationResponse response = userService.verify(user);
            logger.info("User logged in successfully: {}", response.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login error", e);
            return ResponseEntity.badRequest()
                .body(AuthenticationResponse.builder()
                    .message("Login failed: " + e.getMessage())
                    .build());
        }
    }
}
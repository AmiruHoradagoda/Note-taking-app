package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.dto.requests.UserRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.devProject.NoteApp.dto.response.AuthenticationResponse;
import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.service.UserService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
public class AuthenticationController {

    private UserService userService;

    @Autowired
    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));

    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody UserRequestDto user) {

        return ResponseEntity.ok(userService.verify(user));
    }

}

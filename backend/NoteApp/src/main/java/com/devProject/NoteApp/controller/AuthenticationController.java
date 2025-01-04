package com.devProject.NoteApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.devProject.NoteApp.dto.AuthenticationResponse;
import com.devProject.NoteApp.dto.RegisterRequest;
import com.devProject.NoteApp.model.Users;
import com.devProject.NoteApp.service.UserService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
public class AuthenticationController {
        @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody  RegisterRequest request) {
        return  ResponseEntity.ok(userService.register(request));

    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody Users user) {

        return  ResponseEntity.ok(userService.verify(user));
    }
}

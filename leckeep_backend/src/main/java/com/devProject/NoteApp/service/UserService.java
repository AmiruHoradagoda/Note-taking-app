package com.devProject.NoteApp.service;

import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.dto.requests.UserRequestDto;
import com.devProject.NoteApp.dto.response.AuthenticationResponse;
import com.devProject.NoteApp.dto.response.UserResponseDto;
import com.devProject.NoteApp.model.Users;

import java.util.List;

public interface UserService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse verify(UserRequestDto user);

    void initializeUser();

    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(String id);

    UserResponseDto createUser(Users user);

    UserResponseDto updateUser(String id, Users user);

    void deleteUser(String id);
}

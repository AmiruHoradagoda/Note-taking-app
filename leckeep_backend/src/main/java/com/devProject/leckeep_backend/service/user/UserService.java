package com.devProject.leckeep_backend.service.user;

import java.util.List;

import com.devProject.leckeep_backend.dto.requests.RegisterRequest;
import com.devProject.leckeep_backend.dto.requests.UserRequestDto;
import com.devProject.leckeep_backend.dto.response.AuthenticationResponse;
import com.devProject.leckeep_backend.dto.response.UserResponseDto;
import com.devProject.leckeep_backend.model.Users;

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

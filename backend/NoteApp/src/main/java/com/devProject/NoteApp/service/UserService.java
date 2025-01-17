package com.devProject.NoteApp.service;

import com.devProject.NoteApp.dto.requests.UserRequestDto;
import com.devProject.NoteApp.dto.response.AuthenticationResponse;
import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.dto.response.UserResponseDto;
import com.devProject.NoteApp.model.Users;
import com.devProject.NoteApp.repository.UserRepo;
import com.devProject.NoteApp.utils.exception.UserNotFoundException;
import com.devProject.NoteApp.utils.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final JWTService jwtService;
    private final AuthenticationManager authManager;
    private final UserRepo repo;
    private final UserMapper userMapper;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    public UserService(JWTService jwtService, AuthenticationManager authManager, UserRepo repo, UserMapper userMapper) {
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.repo = repo;
        this.userMapper = userMapper;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        Users user = userMapper.toRegisterRequest(request);
        user.setPassword(encoder.encode(user.getPassword()));

        try {
            user = repo.save(user);
            String token = jwtService.generateToken(user.getUsername());
            return AuthenticationResponse.builder()
                    .userId(user.getId())
                    .username(user.getUsername())
                    .token(token)
                    .message("User registered successfully")
                    .build();
        } catch (Exception e) {
            return AuthenticationResponse.builder()
                    .message("Registration failed")
                    .build();
        }
    }

    public AuthenticationResponse verify(UserRequestDto user) {
        // Authenticate the user
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            // Fetch the user, assuming the repository returns Users directly
            Users authenticatedUser = repo.findByUsername(user.getUsername());

            // If user is null, throw an exception
            if (authenticatedUser == null) {
                throw new UserNotFoundException("User not found");
            }

            // Generate the JWT token
            String token = jwtService.generateToken(user.getUsername());

            // Build and return the AuthenticationResponse
            return AuthenticationResponse.builder()
                    .userId(authenticatedUser.getId())
                    .username(user.getUsername())
                    .token(token)
                    .message("Login successful")
                    .build();
        }

        // Return invalid credentials response if authentication fails
        return AuthenticationResponse.builder()
                .message("Invalid credentials")
                .build();
    }


    public List<UserResponseDto> getAllUsers() {
        return repo.findAll().stream()
                .map(userMapper::toUserResponseDto)
                .collect(Collectors.toList());
    }

    public UserResponseDto getUserById(String id) {
        return repo.findById(id)
                .map(userMapper::toUserResponseDto)
                .orElse(null);
    }

    public UserResponseDto createUser(Users user) {
        Users savedUser = repo.save(user);
        return userMapper.toUserResponseDto(savedUser);
    }

    public UserResponseDto updateUser(String id, Users user) {
        user.setId(id);
        Users updatedUser = repo.save(user);
        return userMapper.toUserResponseDto(updatedUser);
    }

    public void deleteUser(String id) {
        repo.deleteById(id);
    }


}

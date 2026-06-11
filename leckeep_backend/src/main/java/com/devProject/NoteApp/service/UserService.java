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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final JWTService jwtService;
    private final AuthenticationManager authManager;
    private final UserRepo repo;
    private final UserMapper userMapper;
    private final PasswordEncoder encoder;

    @Autowired
    public UserService(JWTService jwtService, AuthenticationManager authManager, UserRepo repo, UserMapper userMapper, PasswordEncoder encoder) {
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.repo = repo;
        this.userMapper = userMapper;
        this.encoder = encoder;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        validateNewUser(request.getUsername(), request.getPassword());

        Users user = userMapper.toRegisterRequest(request);
        user.setPassword(encoder.encode(user.getPassword()));

        user = repo.save(user);
        String token = jwtService.generateToken(user.getUsername());
        return AuthenticationResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .token(token)
                .message("User registered successfully")
                .build();
    }

    public void initializeUser() {
        String username = "amiru@gmail.com";

        if (repo.findByUsername(username) != null) {
            return;
        }

        Users user = new Users();
        user.setUsername(username);
        user.setPassword(encoder.encode("amiru@123"));

        repo.save(user);
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
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public UserResponseDto createUser(Users user) {
        validateNewUser(user.getUsername(), user.getPassword());
        user.setPassword(encoder.encode(user.getPassword()));
        Users savedUser = repo.save(user);
        return userMapper.toUserResponseDto(savedUser);
    }

    public UserResponseDto updateUser(String id, Users user) {
        Users existingUser = repo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            Users sameUsernameUser = repo.findByUsername(user.getUsername());
            if (sameUsernameUser != null && !sameUsernameUser.getId().equals(id)) {
                throw new IllegalArgumentException("Username is already taken");
            }
            existingUser.setUsername(user.getUsername());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(encoder.encode(user.getPassword()));
        }

        Users updatedUser = repo.save(existingUser);
        return userMapper.toUserResponseDto(updatedUser);
    }

    public void deleteUser(String id) {
        if (!repo.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        repo.deleteById(id);
    }

    private void validateNewUser(String username, String password) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (repo.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username is already taken");
        }
    }

}

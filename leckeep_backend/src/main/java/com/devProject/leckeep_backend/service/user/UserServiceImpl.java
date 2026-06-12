package com.devProject.leckeep_backend.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devProject.leckeep_backend.dto.requests.RegisterRequest;
import com.devProject.leckeep_backend.dto.requests.UserRequestDto;
import com.devProject.leckeep_backend.dto.response.AuthenticationResponse;
import com.devProject.leckeep_backend.dto.response.UserResponseDto;
import com.devProject.leckeep_backend.exception.UserNotFoundException;
import com.devProject.leckeep_backend.mappers.UserMapper;
import com.devProject.leckeep_backend.model.Users;
import com.devProject.leckeep_backend.repository.UserRepository;
import com.devProject.leckeep_backend.service.auth.JWTService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final JWTService jwtService;
    private final AuthenticationManager authManager;
    private final UserRepository repo;
    private final UserMapper userMapper;
    private final PasswordEncoder encoder;

    @Autowired
    public UserServiceImpl(JWTService jwtService, AuthenticationManager authManager, UserRepository repo, UserMapper userMapper, PasswordEncoder encoder) {
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.repo = repo;
        this.userMapper = userMapper;
        this.encoder = encoder;
    }

    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        validateNewUser(request.getUsername(), request.getPassword(), request.getRegistrationNumber());

        Users user = userMapper.toRegisterRequest(request);
        user.setPassword(encoder.encode(user.getPassword()));

        user = repo.save(user);
        String token = jwtService.generateToken(user.getUsername());
        return AuthenticationResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .registrationNumber(user.getRegistrationNumber())
                .token(token)
                .message("User registered successfully")
                .build();
    }

    @Override
    public void initializeUser() {
        String username = "amiru@gmail.com";

        if (repo.findByUsername(username) != null) {
            return;
        }

        Users user = new Users();
        user.setUsername(username);
        user.setRegistrationNumber("ADMIN-0001");
        user.setPassword(encoder.encode("amiru@123"));

        repo.save(user);
    }

    @Override
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
                    .registrationNumber(authenticatedUser.getRegistrationNumber())
                    .token(token)
                    .message("Login successful")
                    .build();
        }

        // Return invalid credentials response if authentication fails
        return AuthenticationResponse.builder()
                .message("Invalid credentials")
                .build();
    }


    @Override
    public List<UserResponseDto> getAllUsers() {
        return repo.findAll().stream()
                .map(userMapper::toUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto getUserById(String id) {
        return repo.findById(id)
                .map(userMapper::toUserResponseDto)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    @Override
    public UserResponseDto createUser(Users user) {
        validateNewUser(user.getUsername(), user.getPassword(), user.getRegistrationNumber());
        user.setPassword(encoder.encode(user.getPassword()));
        Users savedUser = repo.save(user);
        return userMapper.toUserResponseDto(savedUser);
    }

    @Override
    public UserResponseDto updateUser(String id, Users user) {
        Users existingUser = repo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            Users sameUsernameUser = repo.findByUsername(user.getUsername());
            if (sameUsernameUser != null && !sameUsernameUser.getId().equals(id)) {
                throw new IllegalArgumentException("Username is already taken");
            }
            existingUser.setUsername(user.getUsername().trim());
        }

        if (user.getRegistrationNumber() != null && !user.getRegistrationNumber().isBlank()) {
            String registrationNumber = user.getRegistrationNumber().trim();
            Users sameRegistrationUser = repo.findByRegistrationNumber(registrationNumber);
            if (sameRegistrationUser != null && !sameRegistrationUser.getId().equals(id)) {
                throw new IllegalArgumentException("Registration number is already taken");
            }
            existingUser.setRegistrationNumber(registrationNumber);
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(encoder.encode(user.getPassword()));
        }

        Users updatedUser = repo.save(existingUser);
        return userMapper.toUserResponseDto(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!repo.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        repo.deleteById(id);
    }

    private void validateNewUser(String username, String password, String registrationNumber) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (repo.findByUsername(username.trim()) != null) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (registrationNumber != null && !registrationNumber.isBlank()
                && repo.findByRegistrationNumber(registrationNumber.trim()) != null) {
            throw new IllegalArgumentException("Registration number is already taken");
        }
    }

}

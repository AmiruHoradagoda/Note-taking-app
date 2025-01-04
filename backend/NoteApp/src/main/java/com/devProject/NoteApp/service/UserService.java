package com.devProject.NoteApp.service;

import com.devProject.NoteApp.dto.AuthenticationResponse;
import com.devProject.NoteApp.dto.RegisterRequest;
import com.devProject.NoteApp.model.Users;
import com.devProject.NoteApp.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepo repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

public AuthenticationResponse register(RegisterRequest request) {
    Users user = new Users();
    user.setUsername(request.getUsername());
    user.setPassword(encoder.encode(request.getPassword()));
    
    try {
        repo.save(user);
        String token = jwtService.generateToken(user.getUsername());
        return AuthenticationResponse.builder()
                .token(token)
                .message("User registered successfully")
                .build();
    } catch (Exception e) {
        return AuthenticationResponse.builder()
                .message("Registration failed")
                .build();
    }
}

    public AuthenticationResponse verify(Users user) {
          Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getUsername());
            return AuthenticationResponse.builder()
                    .token(token)
                    .message("Login successful")
                    .build();
        }
        return AuthenticationResponse.builder()
                .message("Invalid credentials")
                .build();
    }

    public List<Users> getAllUsers() {
        return repo.findAll();
    }

    public Users getUserById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Users createUser(Users user) {
        return repo.save(user);
    }

    public Users updateUser(int id, Users user) {
        user.setId(id);
        return repo.save(user);
    }

    public void deleteUser(int id) {
        repo.deleteById(id);
    }
}
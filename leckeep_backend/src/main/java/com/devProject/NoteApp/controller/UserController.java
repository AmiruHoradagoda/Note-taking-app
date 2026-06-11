package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.dto.response.UserResponseDto;
import com.devProject.NoteApp.model.Users;
import com.devProject.NoteApp.service.UserService;
import com.devProject.NoteApp.utils.StandardResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/getAllUsers")
    public StandardResponseDto getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return new StandardResponseDto(200, "Users fetched", users);
    }

    @GetMapping("/{id}")
    public StandardResponseDto getUserById(@PathVariable String id) {
        UserResponseDto user = userService.getUserById(id);
        return new StandardResponseDto(200, "User fetched", user);
    }

    @PostMapping
    public StandardResponseDto createUser(@RequestBody Users user) {
        UserResponseDto createdUser = userService.createUser(user);
        return new StandardResponseDto(201, "User created", createdUser);
    }

    @PutMapping("/{id}")
    public StandardResponseDto updateUser(@PathVariable String id, @RequestBody Users user) {
        UserResponseDto updatedUser = userService.updateUser(id, user);
        return new StandardResponseDto(200, "User updated", updatedUser);
    }

    @DeleteMapping("/{id}")
    public StandardResponseDto deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new StandardResponseDto(200, "User deleted", null);
    }
}

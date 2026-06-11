package com.devProject.NoteApp.mappers;

import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.dto.response.UserResponseDto;
import com.devProject.NoteApp.model.Users;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDto toUserResponseDto(Users users) {
        if (users == null) {
            return null;
        }

        return UserResponseDto.builder()
                .id(users.getId())
                .username(users.getUsername())
                .build();
    }

    public Users toRegisterRequest(RegisterRequest request) {
        if (request == null) {
            return null;
        }

        return Users.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .build();
    }
}

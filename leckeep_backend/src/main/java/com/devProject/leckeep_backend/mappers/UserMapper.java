package com.devProject.leckeep_backend.mappers;

import org.springframework.stereotype.Component;

import com.devProject.leckeep_backend.dto.requests.RegisterRequest;
import com.devProject.leckeep_backend.dto.response.UserResponseDto;
import com.devProject.leckeep_backend.model.Users;

@Component
public class UserMapper {
    public UserResponseDto toUserResponseDto(Users users) {
        if (users == null) {
            return null;
        }

        return UserResponseDto.builder()
                .id(users.getId())
                .username(users.getUsername())
                .registrationNumber(users.getRegistrationNumber())
                .build();
    }

    public Users toRegisterRequest(RegisterRequest request) {
        if (request == null) {
            return null;
        }

        return Users.builder()
                .username(request.getUsername())
                .registrationNumber(request.getRegistrationNumber())
                .password(request.getPassword())
                .build();
    }
}

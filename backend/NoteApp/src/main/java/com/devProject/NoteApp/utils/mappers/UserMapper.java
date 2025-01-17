package com.devProject.NoteApp.utils.mappers;

import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.dto.requests.UserRequestDto;
import com.devProject.NoteApp.dto.response.UserResponseDto;
import com.devProject.NoteApp.model.Users;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toUserResponseDto(Users users);
    Users toRegisterRequest(RegisterRequest request);
}

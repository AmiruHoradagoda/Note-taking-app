package com.devProject.NoteApp.utils.mappers;

import com.devProject.NoteApp.dto.requests.RegisterRequest;
import com.devProject.NoteApp.dto.response.UserResponseDto;
import com.devProject.NoteApp.model.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toUserResponseDto(Users users);

    @Mapping(target = "id", ignore = true)
    Users toRegisterRequest(RegisterRequest request);
}

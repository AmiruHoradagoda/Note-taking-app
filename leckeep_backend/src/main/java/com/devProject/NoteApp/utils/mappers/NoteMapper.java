package com.devProject.NoteApp.utils.mappers;

import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    NoteResponseDto toNoteResponseDto(Note note);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Note toNote(NoteRequestDto noteRequestDto);
}

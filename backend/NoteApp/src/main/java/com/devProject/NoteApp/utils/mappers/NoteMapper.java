package com.devProject.NoteApp.utils.mappers;

import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.model.Note;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    NoteResponseDto toNoteResponseDto(Note note);
    Note toNote(NoteRequestDto noteRequestDto);
}

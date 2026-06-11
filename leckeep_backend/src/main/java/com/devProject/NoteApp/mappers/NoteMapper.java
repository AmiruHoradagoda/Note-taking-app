package com.devProject.NoteApp.mappers;

import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.model.Note;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {
    public NoteResponseDto toNoteResponseDto(Note note) {
        if (note == null) {
            return null;
        }

        return NoteResponseDto.builder()
                .id(note.getId())
                .userId(note.getUserId())
                .title(note.getTitle())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .tags(note.getTags())
                .build();
    }

    public Note toNote(NoteRequestDto noteRequestDto) {
        if (noteRequestDto == null) {
            return null;
        }

        return Note.builder()
                .userId(noteRequestDto.getUserId())
                .title(noteRequestDto.getTitle())
                .content(noteRequestDto.getContent())
                .tags(noteRequestDto.getTags())
                .build();
    }
}

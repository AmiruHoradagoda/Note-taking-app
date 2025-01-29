package com.devProject.NoteApp.service;


import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.model.Note;
import com.devProject.NoteApp.repository.NoteRepository;
import com.devProject.NoteApp.utils.exception.NoteNotFoundException;
import com.devProject.NoteApp.utils.mappers.NoteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;

    @Autowired
    public NoteService(NoteRepository noteRepository, NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.noteMapper = noteMapper;
    }

    public List<NoteResponseDto> getNotesByUserId(String userId) {
        return noteRepository.findByUserId(userId).stream()
                .map(noteMapper::toNoteResponseDto)
                .collect(Collectors.toList());
    }

    public NoteResponseDto getNoteById(String id) {
        Note note = noteRepository.findById(id).orElse(null);
        return noteMapper.toNoteResponseDto(note);
    }

    public NoteResponseDto createNote(NoteRequestDto note) {
        Note savedNote = noteMapper.toNote(note);
        savedNote.setCreatedAt(LocalDateTime.now());
        savedNote.setTags(note.getTags()); //madhawa
        noteRepository.save(savedNote);
        return noteMapper.toNoteResponseDto(savedNote);
    }


    public NoteResponseDto updateNote(String id, NoteRequestDto noteRequestDto) {
        // Check if the note exists
        Note existingNote = noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));

        // Map the incoming DTO to the entity and update fields
        existingNote.setTitle(noteRequestDto.getTitle());
        existingNote.setContent(noteRequestDto.getContent());
        existingNote.setCreatedAt(LocalDateTime.now());
        existingNote.setTags(noteRequestDto.getTags());

        // Save the updated note
        Note updatedNote = noteRepository.save(existingNote);

        // Return the updated note response DTO
        return noteMapper.toNoteResponseDto(updatedNote);
    }


    public void deleteNote(String id) {
        noteRepository.deleteById(id);
    }

    public List<NoteResponseDto> getNoteBySearch(String userId, String searchTxt) {
        return noteRepository.findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
                        userId, searchTxt, userId, searchTxt)
                .stream()
                .map(noteMapper::toNoteResponseDto)
                .collect(Collectors.toList());
    }
}
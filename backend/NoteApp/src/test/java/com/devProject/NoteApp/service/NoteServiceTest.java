package com.devProject.NoteApp.service;

import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.model.Note;
import com.devProject.NoteApp.repository.NoteRepository;
import com.devProject.NoteApp.utils.exception.NoteNotFoundException;
import com.devProject.NoteApp.utils.mappers.NoteMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private NoteMapper noteMapper;

    @InjectMocks
    private NoteService noteService;

    private Note note;
    private NoteResponseDto noteResponseDto;
    private NoteRequestDto noteRequestDto;
    private final String NOTE_ID = "note123";
    private final String USER_ID = "user123";

    @BeforeEach
    void setUp() {
        // Set up test data
        note = new Note();
        note.setId(NOTE_ID);
        note.setTitle("Test Note");
        note.setContent("Test Content");
        note.setUserId(USER_ID);
        note.setCreatedAt(LocalDateTime.now());

        noteResponseDto = new NoteResponseDto();
        noteResponseDto.setId(NOTE_ID);
        noteResponseDto.setTitle("Test Note");
        noteResponseDto.setContent("Test Content");
        noteResponseDto.setUserId(USER_ID);
        noteResponseDto.setCreatedAt(note.getCreatedAt());

        noteRequestDto = new NoteRequestDto();
        noteRequestDto.setTitle("Test Note");
        noteRequestDto.setContent("Test Content");
        noteRequestDto.setUserId(USER_ID);
    }

    @Test
    void getNotesByUserIdTest() {
        // Arrange
        List<Note> notes = Arrays.asList(note);
        when(noteRepository.findByUserId(USER_ID)).thenReturn(notes);
        when(noteMapper.toNoteResponseDto(note)).thenReturn(noteResponseDto);

        // Act
        List<NoteResponseDto> result = noteService.getNotesByUserId(USER_ID);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(NOTE_ID, result.get(0).getId());
        assertEquals("Test Note", result.get(0).getTitle());
        verify(noteRepository).findByUserId(USER_ID);
        verify(noteMapper).toNoteResponseDto(note);
    }

    @Test
    void getNoteByIdTest() {
        // Arrange
        when(noteRepository.findById(NOTE_ID)).thenReturn(Optional.of(note));
        when(noteMapper.toNoteResponseDto(note)).thenReturn(noteResponseDto);

        // Act
        NoteResponseDto result = noteService.getNoteById(NOTE_ID);

        // Assert
        assertNotNull(result);
        assertEquals(NOTE_ID, result.getId());
        assertEquals("Test Note", result.getTitle());
        verify(noteRepository).findById(NOTE_ID);
        verify(noteMapper).toNoteResponseDto(note);
    }

    @Test
    void getNoteByIdNotFoundTest() {
        // Arrange
        when(noteRepository.findById(NOTE_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertNull(noteService.getNoteById(NOTE_ID));
        verify(noteRepository).findById(NOTE_ID);
    }

    @Test
    void createNoteTest() {
        // Arrange
        when(noteMapper.toNote(noteRequestDto)).thenReturn(note);
        when(noteRepository.save(note)).thenReturn(note);
        when(noteMapper.toNoteResponseDto(note)).thenReturn(noteResponseDto);

        // Act
        NoteResponseDto result = noteService.createNote(noteRequestDto);

        // Assert
        assertNotNull(result);
        assertEquals(NOTE_ID, result.getId());
        assertEquals("Test Note", result.getTitle());
        verify(noteMapper).toNote(noteRequestDto);
        verify(noteRepository).save(note);
        verify(noteMapper).toNoteResponseDto(note);
    }

    @Test
    void updateNoteTest() {
        // Arrange
        when(noteRepository.findById(NOTE_ID)).thenReturn(Optional.of(note));
        when(noteRepository.save(any(Note.class))).thenReturn(note);
        when(noteMapper.toNoteResponseDto(note)).thenReturn(noteResponseDto);

        // Act
        NoteResponseDto result = noteService.updateNote(NOTE_ID, noteRequestDto);

        // Assert
        assertNotNull(result);
        assertEquals(NOTE_ID, result.getId());
        assertEquals("Test Note", result.getTitle());
        verify(noteRepository).findById(NOTE_ID);
        verify(noteRepository).save(note);
        verify(noteMapper).toNoteResponseDto(note);
    }

    @Test
    void updateNoteNotFoundTest() {
        // Arrange
        when(noteRepository.findById(NOTE_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NoteNotFoundException.class, () -> noteService.updateNote(NOTE_ID, noteRequestDto));
        verify(noteRepository).findById(NOTE_ID);
        verify(noteRepository, never()).save(any(Note.class));
    }

    @Test
    void deleteNoteTest() {
        // Arrange
        doNothing().when(noteRepository).deleteById(NOTE_ID);

        // Act
        noteService.deleteNote(NOTE_ID);

        // Assert
        verify(noteRepository).deleteById(NOTE_ID);
    }

    @Test
    void getNoteBySearchTest() {
        // Arrange
        String searchText = "Test";
        List<Note> notes = Arrays.asList(note);
        when(noteRepository.findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
                USER_ID, searchText, USER_ID, searchText)).thenReturn(notes);
        when(noteMapper.toNoteResponseDto(note)).thenReturn(noteResponseDto);

        // Act
        List<NoteResponseDto> result = noteService.getNoteBySearch(USER_ID, searchText);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(NOTE_ID, result.get(0).getId());
        verify(noteRepository).findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
                USER_ID, searchText, USER_ID, searchText);
        verify(noteMapper).toNoteResponseDto(note);
    }
}
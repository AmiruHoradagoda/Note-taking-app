package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.service.NoteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class NoteControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NoteService noteService;

    @InjectMocks
    private NoteController noteController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(noteController).build();
    }

    @Test
    void getNotesByUserIdTest() throws Exception {
        // Arrange
        String userId = "user123";
        NoteResponseDto note1 = createNoteResponseDto("note1", "Test Note 1", "Content 1", userId);
        NoteResponseDto note2 = createNoteResponseDto("note2", "Test Note 2", "Content 2", userId);
        List<NoteResponseDto> notes = Arrays.asList(note1, note2);

        when(noteService.getNotesByUserId(userId)).thenReturn(notes);

        // Act & Assert
        mockMvc.perform(get("/api/v1/notes/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("note1"))
                .andExpect(jsonPath("$[0].title").value("Test Note 1"))
                .andExpect(jsonPath("$[1].id").value("note2"))
                .andExpect(jsonPath("$[1].title").value("Test Note 2"));
    }

    @Test
    void getNoteByIdTest() throws Exception {
        // Arrange
        String noteId = "note123";
        NoteResponseDto note = createNoteResponseDto(noteId, "Test Note", "Test Content", "user123");

        when(noteService.getNoteById(noteId)).thenReturn(note);

        // Act & Assert
        mockMvc.perform(get("/api/v1/notes/{id}", noteId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(noteId))
                .andExpect(jsonPath("$.title").value("Test Note"))
                .andExpect(jsonPath("$.content").value("Test Content"))
                .andExpect(jsonPath("$.userId").value("user123"));
    }

    @Test
    void getNoteBySearchTest() throws Exception {
        // Arrange
        String userId = "user123";
        String searchText = "Test";
        NoteResponseDto note1 = createNoteResponseDto("note1", "Test Note 1", "Content 1", userId);
        NoteResponseDto note2 = createNoteResponseDto("note2", "Note 2", "Test Content 2", userId);
        List<NoteResponseDto> notes = Arrays.asList(note1, note2);

        when(noteService.getNoteBySearch(userId, searchText)).thenReturn(notes);

        // Act & Assert
        mockMvc.perform(get("/api/v1/notes/search")
                        .param("userId", userId)
                        .param("searchTxt", searchText))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("note1"))
                .andExpect(jsonPath("$[1].id").value("note2"));
    }

    @Test
    void createNoteTest() throws Exception {
        // Arrange
        NoteRequestDto requestDto = new NoteRequestDto();
        requestDto.setTitle("New Note");
        requestDto.setContent("New Content");
        requestDto.setUserId("user123");

        NoteResponseDto responseDto = createNoteResponseDto("new-note-id", "New Note", "New Content", "user123");

        when(noteService.createNote(any(NoteRequestDto.class))).thenReturn(responseDto);

        // Act & Assert
        mockMvc.perform(post("/api/v1/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("new-note-id"))
                .andExpect(jsonPath("$.title").value("New Note"))
                .andExpect(jsonPath("$.content").value("New Content"))
                .andExpect(jsonPath("$.userId").value("user123"));
    }

    @Test
    void updateNoteTest() throws Exception {
        // Arrange
        String noteId = "note123";
        NoteRequestDto requestDto = new NoteRequestDto();
        requestDto.setTitle("Updated Note");
        requestDto.setContent("Updated Content");
        requestDto.setUserId("user123");

        NoteResponseDto responseDto = createNoteResponseDto(noteId, "Updated Note", "Updated Content", "user123");

        when(noteService.updateNote(eq(noteId), any(NoteRequestDto.class))).thenReturn(responseDto);

        // Act & Assert
        mockMvc.perform(put("/api/v1/notes/{id}", noteId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(noteId))
                .andExpect(jsonPath("$.title").value("Updated Note"))
                .andExpect(jsonPath("$.content").value("Updated Content"));
    }

    @Test
    void deleteNoteTest() throws Exception {
        // Arrange
        String noteId = "note123";
        doNothing().when(noteService).deleteNote(noteId);

        // Act & Assert
        mockMvc.perform(delete("/api/v1/notes/{id}", noteId))
                .andExpect(status().isOk());
    }

    private NoteResponseDto createNoteResponseDto(String id, String title, String content, String userId) {
        NoteResponseDto note = new NoteResponseDto();
        note.setId(id);
        note.setTitle(title);
        note.setContent(content);
        note.setUserId(userId);
        note.setCreatedAt(LocalDateTime.now());
        return note;
    }
}
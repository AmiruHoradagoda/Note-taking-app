package com.devProject.NoteApp.controller;


import com.devProject.NoteApp.dto.requests.NoteRequestDto;
import com.devProject.NoteApp.dto.response.NoteResponseDto;
import com.devProject.NoteApp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
public class NoteController {
    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/user/{userId}")
    public List<NoteResponseDto> getNotesByUserId(@PathVariable String userId) {
        return noteService.getNotesByUserId(userId);
    }

    @GetMapping("/{id}")
    public NoteResponseDto getNoteById(@PathVariable String id) {
        return noteService.getNoteById(id);
    }

    @GetMapping("/search")
    public List<NoteResponseDto> getNoteBySearch(@RequestParam String userId, @RequestParam String searchTxt) {
        return noteService.getNoteBySearch(userId, searchTxt);
    }

    @PostMapping
    public NoteResponseDto createNote(@RequestBody NoteRequestDto note) {
        return noteService.createNote(note);
    }

    @PutMapping("/{id}")
    public NoteResponseDto updateNote(@PathVariable String id, @RequestBody NoteRequestDto note) {
        return noteService.updateNote(id, note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
    }
}

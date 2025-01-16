package com.devProject.NoteApp.service;

import com.devProject.NoteApp.model.Note;
import com.devProject.NoteApp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    private NoteRepository noteRepository;

    @Autowired
    public NoteService( NoteRepository noteRepository){
        this.noteRepository = noteRepository;
    }


    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public List<Note> getNotesByUserId(String userId) {
        return noteRepository.findByUserId(userId);
    }

    public Note getNoteById(String id) {
        return noteRepository.findById(id).orElse(null);
    }

    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    public Note updateNote(String id, Note note) {
        note.setId(id);
        return noteRepository.save(note);
    }

    public void deleteNote(String id) {
        noteRepository.deleteById(id);
    }

    public List<Note> getNoteBySearch(String searchTxt) {
        return noteRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(searchTxt, searchTxt);
    }
}

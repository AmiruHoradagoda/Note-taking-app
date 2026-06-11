package com.devProject.NoteApp.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/subjects")
public class SubjectController {

    @GetMapping
    public String getSubjects() {
        return "GET subjects";
    }

    @PostMapping
    public String createSubject() {
        return "POST subject";
    }

    @PutMapping("/{id}")
    public String updateSubject(@PathVariable String id) {
        return "PUT subject " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteSubject(@PathVariable String id) {
        return "DELETE subject " + id;
    }
}

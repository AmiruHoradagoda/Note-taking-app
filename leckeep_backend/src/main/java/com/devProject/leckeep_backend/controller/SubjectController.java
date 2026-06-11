package com.devProject.leckeep_backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devProject.leckeep_backend.utils.StandardResponseDto;

@RestController
@RequestMapping("/api/v1/subjects")
public class SubjectController {

    @GetMapping
    public StandardResponseDto getSubjects() {
        return new StandardResponseDto(200, "Subjects fetched", "GET subjects");
    }

    @PostMapping
    public StandardResponseDto createSubject() {
        return new StandardResponseDto(201, "Subject created", "POST subject");
    }

    @PutMapping("/{id}")
    public StandardResponseDto updateSubject(@PathVariable String id) {
        return new StandardResponseDto(200, "Subject updated", "PUT subject " + id);
    }

    @DeleteMapping("/{id}")
    public StandardResponseDto deleteSubject(@PathVariable String id) {
        return new StandardResponseDto(200, "Subject deleted", "DELETE subject " + id);
    }
}

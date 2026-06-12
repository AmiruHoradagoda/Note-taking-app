package com.devProject.leckeep_backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devProject.leckeep_backend.dto.requests.SubjectRequestDto;
import com.devProject.leckeep_backend.dto.response.SubjectResponseDto;
import com.devProject.leckeep_backend.service.subject.SubjectService;
import com.devProject.leckeep_backend.utils.StandardResponseDto;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subjects")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public StandardResponseDto getSubjects() {
        List<SubjectResponseDto> subjects = subjectService.getSubjects();
        return new StandardResponseDto(200, "Subjects fetched", subjects);
    }

    @PostMapping
    public StandardResponseDto createSubject(@RequestBody SubjectRequestDto request) {
        SubjectResponseDto subject = subjectService.createSubject(request);
        return new StandardResponseDto(201, "Subject created", subject);
    }

    @PutMapping("/{id}")
    public StandardResponseDto updateSubject(@PathVariable String id, @RequestBody SubjectRequestDto request) {
        SubjectResponseDto subject = subjectService.updateSubject(id, request);
        return new StandardResponseDto(200, "Subject updated", subject);
    }

    @DeleteMapping("/{id}")
    public StandardResponseDto deleteSubject(@PathVariable String id) {
        subjectService.deleteSubject(id);
        return new StandardResponseDto(200, "Subject deleted", null);
    }
}

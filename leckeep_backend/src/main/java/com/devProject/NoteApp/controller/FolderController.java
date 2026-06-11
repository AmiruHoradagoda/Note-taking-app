package com.devProject.NoteApp.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/folders")
public class FolderController {

    @GetMapping
    public String getFolders(@RequestParam(required = false, defaultValue = "private") String scope) {
        return "GET folders scope=" + scope;
    }

    @GetMapping("/{id}")
    public String getFolderById(@PathVariable String id) {
        return "GET folder " + id;
    }

    @PostMapping
    public String createFolder() {
        return "POST folder";
    }

    @PutMapping("/{id}")
    public String updateFolder(@PathVariable String id) {
        return "PUT folder " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteFolder(@PathVariable String id) {
        return "DELETE folder " + id;
    }
}

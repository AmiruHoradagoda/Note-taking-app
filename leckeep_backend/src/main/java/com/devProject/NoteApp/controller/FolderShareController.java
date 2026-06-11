package com.devProject.NoteApp.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/folders/{folderId}/share")
public class FolderShareController {

    @PostMapping
    public String shareFolder(@PathVariable String folderId) {
        return "POST share for folder " + folderId;
    }

    @DeleteMapping
    public String removeFolderShare(@PathVariable String folderId) {
        return "DELETE share for folder " + folderId;
    }
}

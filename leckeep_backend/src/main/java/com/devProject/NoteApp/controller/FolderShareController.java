package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.utils.StandardResponseDto;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/folders/{folderId}/share")
public class FolderShareController {

    @PostMapping
    public StandardResponseDto shareFolder(@PathVariable String folderId) {
        return new StandardResponseDto(200, "Folder share action completed", "POST share for folder " + folderId);
    }

    @DeleteMapping
    public StandardResponseDto removeFolderShare(@PathVariable String folderId) {
        return new StandardResponseDto(200, "Folder share removed", "DELETE share for folder " + folderId);
    }
}

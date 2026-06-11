package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.dto.response.pagination.NoteFolderPaginateResponseDto;
import com.devProject.NoteApp.service.FolderService;
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
    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public NoteFolderPaginateResponseDto getFolders(
            @RequestParam(required = false, defaultValue = "private") String scope,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        return folderService.getFolders(scope, page, size);
    }

    @GetMapping("/{id}")
    public String getFolderById(@PathVariable String id) {
        return folderService.getFolderById(id);
    }

    @PostMapping
    public String createFolder() {
        return folderService.createFolder();
    }

    @PutMapping("/{id}")
    public String updateFolder(@PathVariable String id) {
        return folderService.updateFolder(id);
    }

    @DeleteMapping("/{id}")
    public String deleteFolder(@PathVariable String id) {
        return folderService.deleteFolder(id);
    }
}

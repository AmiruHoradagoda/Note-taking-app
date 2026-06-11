package com.devProject.leckeep_backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devProject.leckeep_backend.dto.requests.NoteFolderRequestDto;
import com.devProject.leckeep_backend.dto.response.NoteFolderResponseDto;
import com.devProject.leckeep_backend.dto.response.pagination.NoteFolderPaginateResponseDto;
import com.devProject.leckeep_backend.service.folder.FolderService;
import com.devProject.leckeep_backend.utils.StandardResponseDto;

@RestController
@RequestMapping("/api/v1/folders")
public class FolderController {
    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public StandardResponseDto getFolders(
            @RequestParam(required = false, defaultValue = "private") String scope,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        NoteFolderPaginateResponseDto folders = folderService.getFolders(scope, page, size);
        return new StandardResponseDto(200, "Folders fetched", folders);
    }

    @GetMapping("/{id}")
    public StandardResponseDto getFolderById(@PathVariable String id) {
        NoteFolderResponseDto folder = folderService.getFolderById(id);
        return new StandardResponseDto(200, "Folder fetched", folder);
    }

    @PostMapping
    public StandardResponseDto createFolder(@RequestBody NoteFolderRequestDto request) {
        NoteFolderResponseDto folder = folderService.createFolder(request);
        return new StandardResponseDto(201, "Folder created", folder);
    }

    @PutMapping("/{id}")
    public StandardResponseDto updateFolder(@PathVariable String id, @RequestBody NoteFolderRequestDto request) {
        NoteFolderResponseDto folder = folderService.updateFolder(id, request);
        return new StandardResponseDto(200, "Folder updated", folder);
    }

    @DeleteMapping("/{id}")
    public StandardResponseDto deleteFolder(@PathVariable String id) {
        folderService.deleteFolder(id);
        return new StandardResponseDto(200, "Folder deleted", null);
    }
}

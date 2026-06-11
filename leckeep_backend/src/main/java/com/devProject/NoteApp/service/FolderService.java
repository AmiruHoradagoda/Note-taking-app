package com.devProject.NoteApp.service;

import com.devProject.NoteApp.dto.requests.NoteFolderRequestDto;
import com.devProject.NoteApp.dto.response.NoteFolderResponseDto;
import com.devProject.NoteApp.dto.response.pagination.NoteFolderPaginateResponseDto;

public interface FolderService {
    NoteFolderPaginateResponseDto getFolders(String scope, int page, int size);

    NoteFolderResponseDto getFolderById(String id);

    NoteFolderResponseDto createFolder(NoteFolderRequestDto request);

    NoteFolderResponseDto updateFolder(String id, NoteFolderRequestDto request);

    void deleteFolder(String id);
}

package com.devProject.NoteApp.service;

import com.devProject.NoteApp.dto.response.pagination.NoteFolderPaginateResponseDto;

public interface FolderService {
    NoteFolderPaginateResponseDto getFolders(String scope, int page, int size);

    String getFolderById(String id);

    String createFolder();

    String updateFolder(String id);

    String deleteFolder(String id);
}

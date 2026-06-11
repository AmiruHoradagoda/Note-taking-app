package com.devProject.leckeep_backend.service.folder;

import com.devProject.leckeep_backend.dto.requests.NoteFolderRequestDto;
import com.devProject.leckeep_backend.dto.response.NoteFolderResponseDto;
import com.devProject.leckeep_backend.dto.response.pagination.NoteFolderPaginateResponseDto;

public interface FolderService {
    NoteFolderPaginateResponseDto getFolders(String scope, int page, int size);

    NoteFolderResponseDto getFolderById(String id);

    NoteFolderResponseDto createFolder(NoteFolderRequestDto request);

    NoteFolderResponseDto updateFolder(String id, NoteFolderRequestDto request);

    void deleteFolder(String id);
}

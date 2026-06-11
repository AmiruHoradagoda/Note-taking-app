package com.devProject.NoteApp.service.impl;

import com.devProject.NoteApp.dto.response.NoteFolderResponseDto;
import com.devProject.NoteApp.dto.response.pagination.NoteFolderPaginateResponseDto;
import com.devProject.NoteApp.enums.FolderVisibility;
import com.devProject.NoteApp.mappers.NoteFolderMapper;
import com.devProject.NoteApp.model.NoteFolder;
import com.devProject.NoteApp.model.UserPrincipal;
import com.devProject.NoteApp.repository.NoteFolderRepository;
import com.devProject.NoteApp.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {
    private static final int MAX_PAGE_SIZE = 100;

    private final NoteFolderRepository noteFolderRepository;
    private final NoteFolderMapper noteFolderMapper;

    @Override
    public NoteFolderPaginateResponseDto getFolders(String scope, int page, int size) {
        Pageable pageable = buildPageable(page, size);
        String normalizedScope = normalizeScope(scope);

        Page<NoteFolder> folderPage = switch (normalizedScope) {
            case "private" -> noteFolderRepository.findByOwnerIdAndVisibility(
                    requireCurrentUserId(),
                    FolderVisibility.PRIVATE,
                    pageable
            );
            case "global" -> noteFolderRepository.findByVisibility(FolderVisibility.GLOBAL, pageable);
            case "group" -> noteFolderRepository.findByVisibility(FolderVisibility.GROUP, pageable);
            case "shared" -> noteFolderRepository.findByOwnerIdAndVisibilityIn(
                    requireCurrentUserId(),
                    List.of(FolderVisibility.GLOBAL, FolderVisibility.GROUP),
                    pageable
            );
            default -> noteFolderRepository.findByOwnerId(requireCurrentUserId(), pageable);
        };

        List<NoteFolderResponseDto> folders = folderPage.getContent()
                .stream()
                .map(noteFolderMapper::toNoteFolderResponseDto)
                .toList();

        return NoteFolderPaginateResponseDto.builder()
                .dataList(folders)
                .dataCount(folderPage.getTotalElements())
                .build();
    }

    @Override
    public String getFolderById(String id) {
        return "GET folder " + id;
    }

    @Override
    public String createFolder() {
        return "POST folder";
    }

    @Override
    public String updateFolder(String id) {
        return "PUT folder " + id;
    }

    @Override
    public String deleteFolder(String id) {
        return "DELETE folder " + id;
    }

    private Pageable buildPageable(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        Sort sort = Sort.by(Sort.Direction.DESC, "updatedAt", "createdAt");
        return PageRequest.of(safePage, safeSize, sort);
    }

    private String normalizeScope(String scope) {
        if (scope == null || scope.isBlank()) {
            return "private";
        }
        return scope.trim().toLowerCase();
    }

    private String requireCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication != null ? authentication.getPrincipal() : null;

        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getUserId();
        }

        throw new IllegalStateException("Authenticated user is required");
    }
}

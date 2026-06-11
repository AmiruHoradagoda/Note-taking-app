package com.devProject.NoteApp.service.impl;

import com.devProject.NoteApp.dto.requests.NoteFolderRequestDto;
import com.devProject.NoteApp.dto.response.NoteFolderResponseDto;
import com.devProject.NoteApp.dto.response.pagination.NoteFolderPaginateResponseDto;
import com.devProject.NoteApp.enums.FolderVisibility;
import com.devProject.NoteApp.exception.FolderNotFoundException;
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
    public NoteFolderResponseDto getFolderById(String id) {
        NoteFolder noteFolder = findFolderOrThrow(id);
        requireFolderReadAccess(noteFolder);
        return noteFolderMapper.toNoteFolderResponseDto(noteFolder);
    }

    @Override
    public NoteFolderResponseDto createFolder(NoteFolderRequestDto request) {
        validateFolderRequest(request);

        NoteFolder noteFolder = noteFolderMapper.toNoteFolder(request, requireCurrentUserId());
        NoteFolder savedFolder = noteFolderRepository.save(noteFolder);
        return noteFolderMapper.toNoteFolderResponseDto(savedFolder);
    }

    @Override
    public NoteFolderResponseDto updateFolder(String id, NoteFolderRequestDto request) {
        validateFolderRequest(request);

        NoteFolder noteFolder = findFolderOrThrow(id);
        requireFolderOwner(noteFolder);
        noteFolderMapper.updateNoteFolder(noteFolder, request);

        NoteFolder updatedFolder = noteFolderRepository.save(noteFolder);
        return noteFolderMapper.toNoteFolderResponseDto(updatedFolder);
    }

    @Override
    public void deleteFolder(String id) {
        NoteFolder noteFolder = findFolderOrThrow(id);
        requireFolderOwner(noteFolder);
        noteFolderRepository.delete(noteFolder);
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

    private NoteFolder findFolderOrThrow(String id) {
        return noteFolderRepository.findById(id)
                .orElseThrow(() -> new FolderNotFoundException("Folder not found with id: " + id));
    }

    private void validateFolderRequest(NoteFolderRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Folder request is required");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Folder title is required");
        }
        if (request.getVisibility() == FolderVisibility.GROUP
                && (request.getGroupId() == null || request.getGroupId().isBlank())) {
            throw new IllegalArgumentException("Group id is required for group folders");
        }
    }

    private void requireFolderReadAccess(NoteFolder noteFolder) {
        if (noteFolder.getVisibility() == FolderVisibility.PRIVATE) {
            requireFolderOwner(noteFolder);
        }
    }

    private void requireFolderOwner(NoteFolder noteFolder) {
        String currentUserId = requireCurrentUserId();
        if (!currentUserId.equals(noteFolder.getOwnerId())) {
            throw new SecurityException("You do not have access to this folder");
        }
    }
}

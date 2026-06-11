package com.devProject.NoteApp.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginationUtils {
    private PaginationUtils() {
    }

    public static Pageable buildPageable(int page, int size, int maxPageSize, Sort sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), maxPageSize);
        return PageRequest.of(safePage, safeSize, sort);
    }
}

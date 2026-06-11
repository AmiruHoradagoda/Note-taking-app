package com.devProject.leckeep_backend.service.document.type;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileTypeHandlerResolver {
    private final List<FileTypeHandler> handlers;

    public FileTypeHandler resolve(String contentType, String extension) {
        return handlers.stream()
                .filter(handler -> handler.supports(contentType, extension))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported file type: " + extension));
    }
}

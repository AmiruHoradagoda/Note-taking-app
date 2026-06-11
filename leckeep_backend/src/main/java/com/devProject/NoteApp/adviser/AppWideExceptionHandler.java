package com.devProject.NoteApp.adviser;

import com.devProject.NoteApp.exception.FolderNotFoundException;
import com.devProject.NoteApp.exception.UserNotFoundException;
import com.devProject.NoteApp.utils.StandardResponseDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppWideExceptionHandler {
    @ExceptionHandler(FolderNotFoundException.class)
    public ResponseEntity<StandardResponseDto> handleBadRequestException(FolderNotFoundException ex) {
        return new ResponseEntity<StandardResponseDto>(
                new StandardResponseDto(400,ex.getMessage(),ex),
                HttpStatus.BAD_REQUEST
        );
    }
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<StandardResponseDto> handleDuplicateEntryException(UserNotFoundException ex) {
        return new ResponseEntity<StandardResponseDto>(
                new StandardResponseDto(409,ex.getMessage(),ex),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardResponseDto> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return new ResponseEntity<StandardResponseDto>(
                new StandardResponseDto(500, "Database constraint violation", ex),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<StandardResponseDto> handleIllegalStateException(IllegalStateException ex) {
        return new ResponseEntity<StandardResponseDto>(
                new StandardResponseDto(500, ex.getMessage(), ex),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}
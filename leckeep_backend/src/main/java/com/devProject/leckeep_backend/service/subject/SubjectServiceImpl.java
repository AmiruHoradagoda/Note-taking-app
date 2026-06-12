package com.devProject.leckeep_backend.service.subject;

import com.devProject.leckeep_backend.dto.requests.SubjectRequestDto;
import com.devProject.leckeep_backend.dto.response.SubjectResponseDto;
import com.devProject.leckeep_backend.mappers.SubjectMapper;
import com.devProject.leckeep_backend.model.Subject;
import com.devProject.leckeep_backend.repository.SubjectRepository;
import com.devProject.leckeep_backend.service.auth.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;
    private final CurrentUserService currentUserService;

    @Override
    public List<SubjectResponseDto> getSubjects() {
        return subjectRepository.findByOwnerId(currentUserService.requireCurrentUserId())
                .stream()
                .sorted(Comparator
                        .comparing(Subject::getSemester, Comparator.nullsLast(String::compareToIgnoreCase))
                        .thenComparing(Subject::getName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(subjectMapper::toSubjectResponseDto)
                .toList();
    }

    @Override
    public SubjectResponseDto createSubject(SubjectRequestDto request) {
        validateSubjectRequest(request);
        String currentUserId = currentUserService.requireCurrentUserId();
        requireUniqueSubjectName(currentUserId, request.getName(), null);

        Subject subject = subjectMapper.toSubject(request, currentUserId);
        Subject savedSubject = subjectRepository.save(subject);
        return subjectMapper.toSubjectResponseDto(savedSubject);
    }

    @Override
    public SubjectResponseDto updateSubject(String id, SubjectRequestDto request) {
        validateSubjectRequest(request);
        String currentUserId = currentUserService.requireCurrentUserId();
        Subject subject = findSubjectOrThrow(id);
        requireSubjectOwner(subject, currentUserId);
        requireUniqueSubjectName(currentUserId, request.getName(), id);

        subjectMapper.updateSubject(subject, request);
        Subject updatedSubject = subjectRepository.save(subject);
        return subjectMapper.toSubjectResponseDto(updatedSubject);
    }

    @Override
    public void deleteSubject(String id) {
        String currentUserId = currentUserService.requireCurrentUserId();
        Subject subject = findSubjectOrThrow(id);
        requireSubjectOwner(subject, currentUserId);
        subjectRepository.delete(subject);
    }

    private Subject findSubjectOrThrow(String id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with id: " + id));
    }

    private void validateSubjectRequest(SubjectRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Subject request is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Subject name is required");
        }
    }

    private void requireUniqueSubjectName(String ownerId, String name, String ignoredSubjectId) {
        subjectRepository.findByOwnerIdAndNameIgnoreCase(ownerId, name.trim())
                .filter(existingSubject -> ignoredSubjectId == null || !ignoredSubjectId.equals(existingSubject.getId()))
                .ifPresent(existingSubject -> {
                    throw new IllegalArgumentException("Subject already exists with name: " + name.trim());
                });
    }

    private void requireSubjectOwner(Subject subject, String currentUserId) {
        if (!currentUserId.equals(subject.getOwnerId())) {
            throw new SecurityException("You do not have access to this subject");
        }
    }
}

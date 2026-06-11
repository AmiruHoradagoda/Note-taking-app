package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.GroupMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends MongoRepository<GroupMember, String> {
    List<GroupMember> findByGroupId(String groupId);

    List<GroupMember> findByUserId(String userId);

    Optional<GroupMember> findByGroupIdAndUserId(String groupId, String userId);

    boolean existsByGroupIdAndUserId(String groupId, String userId);

    void deleteByGroupIdAndUserId(String groupId, String userId);
}

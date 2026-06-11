package com.devProject.NoteApp.controller;

import com.devProject.NoteApp.utils.StandardResponseDto;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

    @GetMapping
    public StandardResponseDto getGroups() {
        return new StandardResponseDto(200, "Groups fetched", "GET groups");
    }

    @PostMapping
    public StandardResponseDto createGroup() {
        return new StandardResponseDto(201, "Group created", "POST group");
    }

    @GetMapping("/{id}")
    public StandardResponseDto getGroupById(@PathVariable String id) {
        return new StandardResponseDto(200, "Group fetched", "GET group " + id);
    }

    @PutMapping("/{id}")
    public StandardResponseDto updateGroup(@PathVariable String id) {
        return new StandardResponseDto(200, "Group updated", "PUT group " + id);
    }

    @DeleteMapping("/{id}")
    public StandardResponseDto deleteGroup(@PathVariable String id) {
        return new StandardResponseDto(200, "Group deleted", "DELETE group " + id);
    }

    @PostMapping("/{id}/members")
    public StandardResponseDto addGroupMember(@PathVariable String id) {
        return new StandardResponseDto(200, "Group member added", "POST member for group " + id);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public StandardResponseDto removeGroupMember(@PathVariable String id, @PathVariable String userId) {
        return new StandardResponseDto(200, "Group member removed", "DELETE member " + userId + " from group " + id);
    }
}

package com.devProject.NoteApp.controller;

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
    public String getGroups() {
        return "GET groups";
    }

    @PostMapping
    public String createGroup() {
        return "POST group";
    }

    @GetMapping("/{id}")
    public String getGroupById(@PathVariable String id) {
        return "GET group " + id;
    }

    @PutMapping("/{id}")
    public String updateGroup(@PathVariable String id) {
        return "PUT group " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteGroup(@PathVariable String id) {
        return "DELETE group " + id;
    }

    @PostMapping("/{id}/members")
    public String addGroupMember(@PathVariable String id) {
        return "POST member for group " + id;
    }

    @DeleteMapping("/{id}/members/{userId}")
    public String removeGroupMember(@PathVariable String id, @PathVariable String userId) {
        return "DELETE member " + userId + " from group " + id;
    }
}

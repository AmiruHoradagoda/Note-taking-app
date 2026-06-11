package com.devProject.NoteApp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    @GetMapping
    public String search(
            @RequestParam(name = "q") String query,
            @RequestParam(required = false, defaultValue = "all") String scope
    ) {
        return "GET search q=" + query + " scope=" + scope;
    }
}

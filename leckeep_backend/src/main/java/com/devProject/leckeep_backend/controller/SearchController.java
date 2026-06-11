package com.devProject.leckeep_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devProject.leckeep_backend.utils.StandardResponseDto;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    @GetMapping
    public StandardResponseDto search(
            @RequestParam(name = "q") String query,
            @RequestParam(required = false, defaultValue = "all") String scope
    ) {
        return new StandardResponseDto(200, "Search completed", "GET search q=" + query + " scope=" + scope);
    }
}

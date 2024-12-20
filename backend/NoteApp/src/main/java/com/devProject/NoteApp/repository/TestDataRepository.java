package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.TestData;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface TestDataRepository extends MongoRepository<TestData, String> {
    List<TestData> findByName(String name);
}
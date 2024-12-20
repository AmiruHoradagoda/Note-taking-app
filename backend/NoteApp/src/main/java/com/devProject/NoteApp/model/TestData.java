package com.devProject.NoteApp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "test_data")
public class TestData {

    @Id
    private String id;
    private String name;

    public TestData() {
    }

    public TestData(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "TestData{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}

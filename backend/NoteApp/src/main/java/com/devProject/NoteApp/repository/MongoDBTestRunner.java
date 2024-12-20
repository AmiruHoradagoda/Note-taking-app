package com.devProject.NoteApp.repository;

import com.devProject.NoteApp.model.TestData;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
class MongoDBTestRunner implements CommandLineRunner {

    private final TestDataRepository repository;

    public MongoDBTestRunner(TestDataRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Clean the collection
        repository.deleteAll();

        // Insert sample data
        TestData data1 = new TestData("Sample Data 1");
        TestData data2 = new TestData("Sample Data 2");
        repository.save(data1);
        repository.save(data2);

        // Retrieve and print all data
        System.out.println("All Test Data:");
        repository.findAll().forEach(System.out::println);

        // Query specific data
        System.out.println("Data with name 'Sample Data 1':");
        repository.findByName("Sample Data 1").forEach(System.out::println);
    }
}

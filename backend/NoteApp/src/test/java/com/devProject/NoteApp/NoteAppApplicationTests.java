package com.devProject.NoteApp;

import com.devProject.NoteApp.repository.NoteRepository;
import com.devProject.NoteApp.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest(properties = {
		"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration,org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"
})
class NoteAppApplicationTests {

	@MockBean
	private NoteRepository noteRepository;

	@MockBean
	private UserRepo userRepo;

	@Test
	void contextLoads() {
	}

}

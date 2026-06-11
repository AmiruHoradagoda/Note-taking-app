package com.devProject.NoteApp;

import com.devProject.NoteApp.repository.DocumentFileRepository;
import com.devProject.NoteApp.repository.FolderShareRepository;
import com.devProject.NoteApp.repository.GroupMemberRepository;
import com.devProject.NoteApp.repository.NoteFolderRepository;
import com.devProject.NoteApp.repository.StudyGroupRepository;
import com.devProject.NoteApp.repository.SubjectRepository;
import com.devProject.NoteApp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest(properties = {
		"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration,org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"
})
class NoteAppApplicationTests {

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private SubjectRepository subjectRepository;

	@MockBean
	private NoteFolderRepository noteFolderRepository;

	@MockBean
	private DocumentFileRepository documentFileRepository;

	@MockBean
	private StudyGroupRepository studyGroupRepository;

	@MockBean
	private GroupMemberRepository groupMemberRepository;

	@MockBean
	private FolderShareRepository folderShareRepository;

	@Test
	void contextLoads() {
	}

}

package com.devProject.leckeep_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.devProject.leckeep_backend.service.user.UserService;

@SpringBootApplication
public class NoteAppApplication implements CommandLineRunner {

	private final UserService userService;

	public NoteAppApplication(UserService userService) {
		this.userService = userService;
	}

	public static void main(String[] args) {
		SpringApplication.run(NoteAppApplication.class, args);
	}

	@Override
	public void run(String... args) {
		userService.initializeUser();
	}

}

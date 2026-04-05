package com.example.experiment7;

import com.example.experiment7.entity.AppUser;
import com.example.experiment7.entity.Role;
import com.example.experiment7.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class Experiment7Application {

    public static void main(String[] args) {
        SpringApplication.run(Experiment7Application.class, args);
    }

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("user1").isEmpty()) {
                userRepository.save(new AppUser(null, "user1", passwordEncoder.encode("user123"), Role.ROLE_USER));
            }

            if (userRepository.findByUsername("admin1").isEmpty()) {
                userRepository.save(new AppUser(null, "admin1", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN));
            }
        };
    }
}

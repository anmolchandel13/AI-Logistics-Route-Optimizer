package com.logistics.optimizer.config;

import com.logistics.optimizer.entity.User;
import com.logistics.optimizer.enums.Role;
import com.logistics.optimizer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user if not exists
        if (!userRepository.existsByEmail("admin@logistics.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@logistics.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("+1-555-0100")
                    .company("LogiTech Solutions")
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Default admin user created: admin@logistics.com / admin123");
        }

        // Create default demo user if not exists
        if (!userRepository.existsByEmail("user@logistics.com")) {
            User demoUser = User.builder()
                    .name("Demo User")
                    .email("user@logistics.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .phone("+1-555-0200")
                    .company("Global Shipping Co.")
                    .active(true)
                    .build();
            userRepository.save(demoUser);
            log.info("✅ Default demo user created: user@logistics.com / user123");
        }
    }
}

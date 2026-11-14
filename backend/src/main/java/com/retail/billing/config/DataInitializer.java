package com.retail.billing.config;

import com.retail.billing.entity.User;
import com.retail.billing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin@example.com").isEmpty()) {
            User admin = User.builder()
                    .username("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .fullName("Systems Admin")
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@example.com / admin123");
        }
    }
}

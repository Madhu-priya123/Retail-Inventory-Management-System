package com.retail.billing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ADMIN, STAFF

    private String fullName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    private String theme; // default, dark, ocean, sunset
    private String email;
    private boolean autoEmailPdf;
}

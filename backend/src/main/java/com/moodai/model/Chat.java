package com.moodai.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 4000)
    private String userMessage;

    @Column(length = 8000)
    private String aiResponse;

    @Column(length = 64)
    private String detectedMood; // e.g., happy, sad, angry, neutral

    @Column(nullable = false)
    private Instant createdAt;
}



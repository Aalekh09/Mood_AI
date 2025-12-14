package com.moodai.controller;

import com.moodai.model.Chat;
import com.moodai.model.User;
import com.moodai.repository.UserRepository;
import com.moodai.service.AiService;
import com.moodai.service.ChatService;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final UserRepository userRepository;
    private final AiService aiService;

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody ChatRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Chat saved = chatService.saveChat(user, request.getMessage());
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "reply", saved.getAiResponse(),
                "mood", saved.getDetectedMood(),
                "createdAt", saved.getCreatedAt()
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Chat>> history(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(chatService.getChats(user));
    }

    @PostMapping("/anonymous")
    public ResponseEntity<?> anonymous(@RequestBody ChatRequest request) {
        // Anonymous chat not persisted
        AiService.AiResult ai = aiService.generateResponse(request.getMessage());
        return ResponseEntity.ok(Map.of("reply", ai.reply(), "mood", ai.detectedMood()));
    }

    @Data
    public static class ChatRequest {
        @NotBlank
        private String message;
    }
}



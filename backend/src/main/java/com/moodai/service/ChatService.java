package com.moodai.service;

import com.moodai.model.Chat;
import com.moodai.model.User;
import com.moodai.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final AiService aiService;

    public Chat saveChat(User user, String userMessage) {
        AiService.AiResult ai = aiService.generateResponse(userMessage);
        Chat chat = Chat.builder()
                .user(user)
                .userMessage(userMessage)
                .aiResponse(ai.reply())
                .detectedMood(ai.detectedMood())
                .createdAt(Instant.now())
                .build();
        return chatRepository.save(chat);
    }

    public List<Chat> getChats(User user) {
        return chatRepository.findByUserOrderByCreatedAtDesc(user);
    }
}



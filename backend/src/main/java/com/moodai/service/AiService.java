package com.moodai.service;

public interface AiService {
    AiResult generateResponse(String userMessage);

    record AiResult(String reply, String detectedMood) {}
}



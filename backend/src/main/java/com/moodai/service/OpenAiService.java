package com.moodai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class OpenAiService implements AiService {

    private final String apiKey;
    private final String model;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public OpenAiService(
            @Value("${openai.api.key:}") String apiKey,
            @Value("${OPENAI_MODEL:gpt-4o-mini}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public AiResult generateResponse(String userMessage) {
        if (apiKey == null || apiKey.isBlank()) {
            // Fallback if no key configured
            return new AiResult(
                    "I hear you. Thanks for sharing. (AI key not configured)",
                    heuristicMood(userMessage)
            );
        }
        try {
            String system = "You are an empathetic mental wellness assistant. " +
                    "Respond concisely, supportive, and safe. " +
                    "Return a strict JSON object with keys reply and mood where mood is one of: happy, sad, angry, neutral. " +
                    "Do not include any extra text outside JSON.";

            String body = mapper.createObjectNode()
                    .put("model", model)
                    .set("messages", mapper.createArrayNode()
                            .add(mapper.createObjectNode().put("role", "system").put("content", system))
                            .add(mapper.createObjectNode().put("role", "user").put("content", userMessage))
                    ).toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = mapper.readTree(response.body());
                String content = root.path("choices").path(0).path("message").path("content").asText("");
                // content should be JSON per system instruction
                String reply = "Thanks for sharing.";
                String mood = "neutral";
                try {
                    JsonNode contentJson = mapper.readTree(content);
                    reply = contentJson.path("reply").asText(reply);
                    mood = contentJson.path("mood").asText(mood);
                } catch (Exception ignore) {
                    // Model returned unexpected text; fallback heuristics
                    reply = content.isBlank() ? reply : content;
                    mood = heuristicMood(userMessage);
                }
                return new AiResult(reply, mood);
            } else {
                return new AiResult(
                        "I'm here for you. Let's talk more about how you feel.",
                        heuristicMood(userMessage)
                );
            }
        } catch (Exception e) {
            return new AiResult(
                    "I’m sorry, I had trouble responding just now. Could you rephrase that?",
                    heuristicMood(userMessage)
            );
        }
    }

    private String heuristicMood(String text) {
        String t = text == null ? "" : text.toLowerCase();
        if (t.contains("happy") || t.contains("great") || t.contains("good")) return "happy";
        if (t.contains("sad") || t.contains("down") || t.contains("depress")) return "sad";
        if (t.contains("angry") || t.contains("mad") || t.contains("furious")) return "angry";
        return "neutral";
    }
}



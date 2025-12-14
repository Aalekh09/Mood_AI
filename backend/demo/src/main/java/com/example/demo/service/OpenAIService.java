package com.example.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
@Slf4j
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // Store conversation context for better responses
    private final Map<String, List<Map<String, String>>> conversationHistory = new HashMap<>();

    public String getChatResponse(String userMessage) {
        return getChatResponse(userMessage, null);
    }

    public String getChatResponse(String userMessage, String userId) {
        try {
            // Analyze sentiment first
            String sentiment = analyzeSentiment(userMessage);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // Build dynamic system prompt based on context
            String systemPrompt = buildDynamicSystemPrompt(sentiment, userMessage);

            // Get conversation history for context
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));

            // Add recent conversation history if user is logged in
            if (userId != null && conversationHistory.containsKey(userId)) {
                List<Map<String, String>> history = conversationHistory.get(userId);
                // Only keep last 4 messages for context (2 exchanges)
                int startIndex = Math.max(0, history.size() - 4);
                messages.addAll(history.subList(startIndex, history.size()));
            }

            // Add current user message
            messages.add(Map.of("role", "user", "content", userMessage));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 400);
            requestBody.put("temperature", 0.9); // Higher for more creative responses
            requestBody.put("presence_penalty", 0.6); // Encourage diverse responses
            requestBody.put("frequency_penalty", 0.3); // Reduce repetition

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String aiResponse = (String) message.get("content");

                    // Store conversation history
                    if (userId != null) {
                        storeConversation(userId, userMessage, aiResponse);
                    }

                    return aiResponse;
                }
            }

            return getDynamicFallbackResponse(sentiment, userMessage);

        } catch (Exception e) {
            log.error("Error calling OpenAI API: ", e);
            return getDynamicFallbackResponse(analyzeSentiment(userMessage), userMessage);
        }
    }

    private String buildDynamicSystemPrompt(String sentiment, String userMessage) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are Mood AI, an advanced empathetic mental wellness companion similar to Claude AI. ");
        prompt.append("You provide thoughtful, personalized, and contextually aware responses. ");

        // Core capabilities
        prompt.append("\n\n**Your Capabilities:**\n");
        prompt.append("- Provide emotional support and validation\n");
        prompt.append("- Suggest practical coping strategies and solutions\n");
        prompt.append("- Recommend music, activities, books, movies based on mood\n");
        prompt.append("- Share breathing exercises and mindfulness techniques\n");
        prompt.append("- Tell jokes or share uplifting content when appropriate\n");
        prompt.append("- Offer motivational quotes and wisdom\n");
        prompt.append("- Ask thoughtful follow-up questions to understand deeper\n");
        prompt.append("- Provide actionable, specific advice\n");

        // Mood-specific instructions
        prompt.append("\n**Current Context:**\n");

        switch (sentiment) {
            case "POSITIVE":
                prompt.append("The user is experiencing POSITIVE emotions. ");
                prompt.append("Celebrate with them genuinely! Share their joy and suggest ways to maintain and amplify this positive energy. ");
                prompt.append("Recommend uplifting music, fun activities, or ways to spread this positivity to others. ");
                prompt.append("Be enthusiastic and energetic in your tone. ");
                prompt.append("Maybe suggest: journaling this moment, sharing happiness with loved ones, or creative activities.");
                break;

            case "NEGATIVE":
                prompt.append("The user is experiencing NEGATIVE emotions or distress. ");
                prompt.append("Be extra compassionate, patient, and validating. This is a vulnerable moment. ");
                prompt.append("First, acknowledge their feelings without judgment. ");
                prompt.append("Then provide practical, actionable coping strategies such as:\n");
                prompt.append("- Specific breathing exercises (4-7-8 technique, box breathing)\n");
                prompt.append("- Grounding techniques (5-4-3-2-1 method)\n");
                prompt.append("- Calming music recommendations (specific songs/artists)\n");
                prompt.append("- Physical activities (walk, stretch, yoga poses)\n");
                prompt.append("- Gentle humor if appropriate (not dismissive)\n");
                prompt.append("- Reminders that feelings are temporary\n");
                prompt.append("Offer to listen more if they want to talk about it. ");
                prompt.append("If they seem severely distressed, gently suggest professional help.");
                break;

            default:
                prompt.append("The user has a NEUTRAL mood. ");
                prompt.append("Engage naturally and help them explore their current state. ");
                prompt.append("Ask thoughtful questions to understand them better. ");
                prompt.append("Suggest activities, music, or reflections that might add positivity to their day. ");
                prompt.append("Be warm, conversational, and genuinely interested in their wellbeing.");
        }

        // Response style guidelines
        prompt.append("\n\n**Response Style:**\n");
        prompt.append("- Be conversational and natural, like a caring friend\n");
        prompt.append("- Use emojis moderately and appropriately (2-3 per response)\n");
        prompt.append("- Keep responses concise but meaningful (3-5 short paragraphs)\n");
        prompt.append("- Use bullet points or numbered lists for actionable advice\n");
        prompt.append("- Be specific: name actual songs, books, techniques, activities\n");
        prompt.append("- Ask one thoughtful follow-up question to continue the conversation\n");
        prompt.append("- Adapt your tone to match their emotional state\n");
        prompt.append("- Never use generic phrases like 'I'm here for you' without adding substance\n");

        // What to avoid
        prompt.append("\n**Important - Avoid:**\n");
        prompt.append("- Being preachy or giving unsolicited advice\n");
        prompt.append("- Toxic positivity (don't dismiss negative feelings)\n");
        prompt.append("- Repetitive or template-like responses\n");
        prompt.append("- Being overly formal or clinical\n");
        prompt.append("- Lengthy paragraphs without structure\n");

        return prompt.toString();
    }

    private void storeConversation(String userId, String userMessage, String aiResponse) {
        conversationHistory.putIfAbsent(userId, new ArrayList<>());
        List<Map<String, String>> history = conversationHistory.get(userId);

        history.add(Map.of("role", "user", "content", userMessage));
        history.add(Map.of("role", "assistant", "content", aiResponse));

        // Keep only last 10 messages (5 exchanges) to avoid memory issues
        if (history.size() > 10) {
            history.subList(0, history.size() - 10).clear();
        }
    }

    public void clearConversationHistory(String userId) {
        conversationHistory.remove(userId);
    }

    private String getDynamicFallbackResponse(String sentiment, String userMessage) {
        // Even fallback responses are more dynamic
        StringBuilder response = new StringBuilder();

        switch (sentiment) {
            case "POSITIVE":
                response.append("I can feel the positive energy in your message! 🌟 That's wonderful!\n\n");
                response.append("To keep this momentum going, here are some specific ideas:\n\n");
                response.append("🎵 **Music to match your vibe:**\n");
                response.append("• \"Happy\" by Pharrell Williams\n");
                response.append("• \"Don't Stop Me Now\" by Queen\n");
                response.append("• \"Good Vibrations\" by The Beach Boys\n\n");
                response.append("✨ **Amplify this feeling:**\n");
                response.append("• Share your joy with someone you care about via call or text\n");
                response.append("• Write down what's making you happy (great to revisit later!)\n");
                response.append("• Try a spontaneous dance session in your room\n");
                response.append("• Channel this energy into a creative project\n\n");
                response.append("What specifically is bringing you this happiness today? I'd love to hear more about it! 😊");
                break;

            case "NEGATIVE":
                response.append("I hear you, and I want you to know that what you're feeling is completely valid. 💙\n\n");
                response.append("Let's try something right now that might help:\n\n");
                response.append("🌊 **Immediate Calm - 4-7-8 Breathing:**\n");
                response.append("1. Breathe in through your nose for 4 seconds\n");
                response.append("2. Hold your breath for 7 seconds\n");
                response.append("3. Exhale slowly through your mouth for 8 seconds\n");
                response.append("4. Repeat 3 times\n\n");
                response.append("🎵 **Calming soundscape:**\n");
                response.append("• \"Weightless\" by Marconi Union (scientifically proven to reduce anxiety)\n");
                response.append("• \"Clair de Lune\" by Debussy\n");
                response.append("• Try rain sounds or nature ambience on YouTube\n\n");
                response.append("💚 **What might help right now:**\n");
                response.append("• Take a 10-minute walk (even around your room counts!)\n");
                response.append("• Splash cold water on your face (engages nervous system reset)\n");
                response.append("• Text a friend just to say hi\n");
                response.append("• Watch a comfort show or funny video (laughter is medicine)\n\n");
                response.append("Would you like to tell me more about what's going on? Sometimes talking it through helps. I'm here to listen. 🤗");
                break;

            default:
                response.append("Thanks for sharing with me! 😊\n\n");
                response.append("I'm curious - what's your energy level right now? That can tell us a lot about what might help.\n\n");
                response.append("🎯 **Quick mood shifters (pick what sounds good):**\n\n");
                response.append("**If you need energy:**\n");
                response.append("• 5-minute dance party to \"Shut Up and Dance\" by Walk the Moon\n");
                response.append("• Do 10 jumping jacks (gets blood flowing!)\n");
                response.append("• Make yourself a colorful snack or smoothie\n\n");
                response.append("**If you need calm:**\n");
                response.append("• Try the \"5-4-3-2-1\" grounding exercise (name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste)\n");
                response.append("• Listen to \"River Flows In You\" by Yiruma\n");
                response.append("• Sit by a window and just observe for 5 minutes\n\n");
                response.append("**If you want connection:**\n");
                response.append("• Send a random appreciation text to someone\n");
                response.append("• Join an online community about something you like\n");
                response.append("• Share something you're grateful for (even small things count!)\n\n");
                response.append("What resonates with you right now? What would feel good? 💭");
        }

        return response.toString();
    }

    public String analyzeSentiment(String text) {
        String lowerText = text.toLowerCase();

        // Comprehensive emotion detection
        Map<String, List<String>> emotionKeywords = new HashMap<>();

        emotionKeywords.put("POSITIVE", Arrays.asList(
                "happy", "joy", "great", "excellent", "wonderful", "good", "better", "best", "love",
                "excited", "grateful", "amazing", "fantastic", "awesome", "blessed", "thankful",
                "proud", "delighted", "cheerful", "optimistic", "hopeful", "satisfied", "pleased",
                "thrilled", "ecstatic", "elated", "joyful", "content", "lucky", "fortunate"
        ));

        emotionKeywords.put("NEGATIVE", Arrays.asList(
                "sad", "depressed", "angry", "anxious", "worried", "bad", "terrible", "hate",
                "stressed", "upset", "lonely", "hopeless", "scared", "frustrated", "hurt",
                "pain", "crying", "afraid", "miserable", "overwhelmed", "exhausted", "tired",
                "broken", "lost", "empty", "numb", "helpless", "worthless", "afraid", "panic",
                "anxiety", "depression", "stress", "fear", "anger", "grief", "disappointed"
        ));

        int positiveCount = 0;
        int negativeCount = 0;
        int positiveIntensity = 0;
        int negativeIntensity = 0;

        for (String word : emotionKeywords.get("POSITIVE")) {
            if (lowerText.contains(word)) {
                positiveCount++;
                positiveIntensity += lowerText.split(word, -1).length - 1;
            }
        }

        for (String word : emotionKeywords.get("NEGATIVE")) {
            if (lowerText.contains(word)) {
                negativeCount++;
                negativeIntensity += lowerText.split(word, -1).length - 1;
            }
        }

        // Consider both count and intensity
        if (positiveIntensity > negativeIntensity && positiveCount > 0) {
            return "POSITIVE";
        } else if (negativeIntensity > positiveIntensity && negativeCount > 0) {
            return "NEGATIVE";
        } else if (positiveCount > 0 || negativeCount > 0) {
            // Mixed emotions - lean towards negative for safety (provide support)
            return negativeCount >= positiveCount ? "NEGATIVE" : "POSITIVE";
        }

        return "NEUTRAL";
    }

    public Double calculateMoodScore(String sentiment) {
        Random random = new Random();
        return switch (sentiment) {
            case "POSITIVE" -> 0.70 + (random.nextDouble() * 0.30); // 0.70-1.0
            case "NEGATIVE" -> random.nextDouble() * 0.40; // 0.0-0.40
            default -> 0.35 + (random.nextDouble() * 0.40); // 0.35-0.75
        };
    }
}
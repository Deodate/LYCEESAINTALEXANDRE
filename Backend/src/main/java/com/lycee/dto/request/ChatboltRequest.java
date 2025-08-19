package com.lycee.dto.request;

import java.time.LocalDateTime;

public class ChatboltRequest {
    private String sessionChatid;
    private String userType;
    private String userMessage;
    private String botResponse;

    // Getters and Setters
    public String getSessionChatid() {
        return sessionChatid;
    }

    public void setSessionChatid(String sessionChatid) {
        this.sessionChatid = sessionChatid;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }

    public String getBotResponse() {
        return botResponse;
    }

    public void setBotResponse(String botResponse) {
        this.botResponse = botResponse;
    }
} 
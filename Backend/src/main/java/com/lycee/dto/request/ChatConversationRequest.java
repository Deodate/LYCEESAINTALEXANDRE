package com.lycee.dto.request;

public class ChatConversationRequest {
    private String name;
    private String phoneNumber;
    private String sessionId; // Optional: for tracking conversation sessions
    private String userType; // Optional: student, parent, etc.

    // Default constructor
    public ChatConversationRequest() {}

    // Constructor with required fields
    public ChatConversationRequest(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    // Constructor with all fields
    public ChatConversationRequest(String name, String phoneNumber, String sessionId, String userType) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.sessionId = sessionId;
        this.userType = userType;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}


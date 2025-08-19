package com.lycee.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatbolt")
public class Chatbolt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatid;

    @Column(name = "session_chatid")
    private String sessionChatid;

    @Column(name = "user_type")
    private String userType;

    @Column(name = "user_message")
    private String userMessage;

    @Column(name = "bot_response")
    private String botResponse;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // Constructors
    public Chatbolt() {
    }

    public Chatbolt(String sessionChatid, String userType, String userMessage, String botResponse, LocalDateTime timestamp) {
        this.sessionChatid = sessionChatid;
        this.userType = userType;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getChatid() {
        return chatid;
    }

    public void setChatid(Long chatid) {
        this.chatid = chatid;
    }

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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 
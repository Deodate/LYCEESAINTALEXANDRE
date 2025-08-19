package com.lycee.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_inquiry")
public class ChatInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "question", length = 1000, nullable = false)
    private String question;

    @Column(name = "answer", length = 2000)
    private String answer;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ChatInquiry() {}

    public ChatInquiry(String name, String phoneNumber, String question, String answer, LocalDateTime createdAt) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.question = question;
        this.answer = answer;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}



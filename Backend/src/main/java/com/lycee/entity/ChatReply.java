package com.lycee.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_reply")
public class ChatReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;

    @Column(name = "reply_message", length = 2000, nullable = false)
    private String replyMessage;

    @Column(name = "replied_by", length = 100)
    private String repliedBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ChatReply() {}

    public ChatReply(Long conversationId, String replyMessage, String repliedBy, LocalDateTime createdAt) {
        this.conversationId = conversationId;
        this.replyMessage = replyMessage;
        this.repliedBy = repliedBy;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    
    public String getReplyMessage() { return replyMessage; }
    public void setReplyMessage(String replyMessage) { this.replyMessage = replyMessage; }
    
    public String getRepliedBy() { return repliedBy; }
    public void setRepliedBy(String repliedBy) { this.repliedBy = repliedBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}








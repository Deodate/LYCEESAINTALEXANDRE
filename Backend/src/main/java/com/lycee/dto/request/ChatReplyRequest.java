package com.lycee.dto.request;

public class ChatReplyRequest {
    private Long conversationId;
    private String replyMessage;
    private String repliedBy;

    public ChatReplyRequest() {}

    public ChatReplyRequest(Long conversationId, String replyMessage, String repliedBy) {
        this.conversationId = conversationId;
        this.replyMessage = replyMessage;
        this.repliedBy = repliedBy;
    }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getReplyMessage() { return replyMessage; }
    public void setReplyMessage(String replyMessage) { this.replyMessage = replyMessage; }

    public String getRepliedBy() { return repliedBy; }
    public void setRepliedBy(String repliedBy) { this.repliedBy = repliedBy; }
}








package com.lycee.service;

import com.lycee.entity.ChatReply;
import java.util.List;

public interface ChatReplyService {
    ChatReply saveReply(ChatReply reply);
    List<ChatReply> getRepliesByConversationId(Long conversationId);
}








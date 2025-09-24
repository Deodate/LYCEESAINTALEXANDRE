package com.lycee.service.impl;

import com.lycee.entity.ChatReply;
import com.lycee.repository.ChatReplyRepository;
import com.lycee.service.ChatReplyService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatReplyServiceImpl implements ChatReplyService {
    private final ChatReplyRepository repository;

    public ChatReplyServiceImpl(ChatReplyRepository repository) {
        this.repository = repository;
    }

    @Override
    public ChatReply saveReply(ChatReply reply) {
        if (reply.getCreatedAt() == null) {
            reply.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(reply);
    }

    @Override
    public List<ChatReply> getRepliesByConversationId(Long conversationId) {
        return repository.findByConversationIdOrderByCreatedAtDesc(conversationId);
    }
}








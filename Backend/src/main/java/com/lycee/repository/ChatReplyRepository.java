package com.lycee.repository;

import com.lycee.entity.ChatReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatReplyRepository extends JpaRepository<ChatReply, Long> {
    List<ChatReply> findByConversationIdOrderByCreatedAtDesc(Long conversationId);
}








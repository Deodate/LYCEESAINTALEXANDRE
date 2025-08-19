package com.lycee.mapper;

import com.lycee.dto.request.ChatboltRequest;
import com.lycee.entity.Chatbolt;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ChatboltMapper {

    public Chatbolt toEntity(ChatboltRequest request) {
        if (request == null) {
            return null;
        }
        Chatbolt chatbolt = new Chatbolt();
        chatbolt.setSessionChatid(request.getSessionChatid());
        chatbolt.setUserType(request.getUserType());
        chatbolt.setUserMessage(request.getUserMessage());
        chatbolt.setBotResponse(request.getBotResponse());
        chatbolt.setTimestamp(LocalDateTime.now()); // Set current timestamp
        return chatbolt;
    }
} 
package com.lycee.service.impl;

import com.lycee.entity.Chatbolt;
import com.lycee.repository.ChatboltRepository;
import com.lycee.service.ChatboltService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatboltServiceImpl implements ChatboltService {

    private final ChatboltRepository chatboltRepository;

    @Autowired
    public ChatboltServiceImpl(ChatboltRepository chatboltRepository) {
        this.chatboltRepository = chatboltRepository;
    }

    @Override
    public Chatbolt saveChatMessage(Chatbolt chatMessage) {
        return chatboltRepository.save(chatMessage);
    }

    @Override
    public List<Chatbolt> getAllChatMessages() {
        return chatboltRepository.findAll();
    }
} 
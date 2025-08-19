package com.lycee.service;

import com.lycee.entity.Chatbolt;

import java.util.List;

public interface ChatboltService {
    Chatbolt saveChatMessage(Chatbolt chatMessage);
    List<Chatbolt> getAllChatMessages();
}
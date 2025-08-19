package com.lycee.validation;

import com.lycee.dto.request.ChatboltRequest;
import com.lycee.exception.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ChatMessageValidator {

    public void validateChatMessageRequest(ChatboltRequest request) {
        if (request == null) {
            throw new ValidationException("Chat message request cannot be null.");
        }
        if (!StringUtils.hasText(request.getSessionChatid()) ||
            !StringUtils.hasText(request.getUserType()) ||
            !StringUtils.hasText(request.getUserMessage())) {
            throw new ValidationException("Session ID, user type, and user message cannot be empty.");
        }
    }
} 
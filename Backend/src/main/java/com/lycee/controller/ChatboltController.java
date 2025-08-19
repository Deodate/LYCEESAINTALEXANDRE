package com.lycee.controller;

import com.lycee.dto.request.ChatboltRequest;
import com.lycee.dto.response.ApiResponse;
import com.lycee.dto.response.ErrorResponse;
import com.lycee.entity.Chatbolt;
import com.lycee.exception.ValidationException;
import com.lycee.mapper.ChatboltMapper;
import com.lycee.service.ChatboltService;
import com.lycee.validation.ChatMessageValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chatbolt")
public class ChatboltController {

    private final ChatboltService chatboltService;
    private final ChatboltMapper chatboltMapper;
    private final ChatMessageValidator chatMessageValidator;

    @Autowired
    public ChatboltController(ChatboltService chatboltService, ChatboltMapper chatboltMapper, ChatMessageValidator chatMessageValidator) {
        this.chatboltService = chatboltService;
        this.chatboltMapper = chatboltMapper;
        this.chatMessageValidator = chatMessageValidator;
    }

    @PostMapping
    public ResponseEntity<Object> saveChatMessage(@RequestBody ChatboltRequest chatboltRequest) {
        try {
            chatMessageValidator.validateChatMessageRequest(chatboltRequest);
            Chatbolt chatbolt = chatboltMapper.toEntity(chatboltRequest);
            Chatbolt savedChatbolt = chatboltService.saveChatMessage(chatbolt);
            ApiResponse<Chatbolt> response = new ApiResponse<>(HttpStatus.CREATED.value(), "Chat message saved successfully", savedChatbolt);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ValidationException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<Object> getAllChatMessages() {
        try {
            List<Chatbolt> chatMessages = chatboltService.getAllChatMessages();
            ApiResponse<List<Chatbolt>> response = new ApiResponse<>(HttpStatus.OK.value(), "All chat messages retrieved successfully", chatMessages);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 
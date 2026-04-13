package com.lycee.controller;

import com.lycee.dto.request.ChatConversationRequest;
import com.lycee.dto.request.ChatReplyRequest;
import com.lycee.dto.response.ApiResponse;
import com.lycee.dto.response.ErrorResponse;
import com.lycee.entity.ChatInquiry;
import com.lycee.entity.ChatReply;
import com.lycee.service.ChatInquiryService;
import com.lycee.service.ChatReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/chat-conversation")
@CrossOrigin(origins = "*")
@Tag(name = "4. Chat conversation")
public class ChatConversationController {

    private final ChatInquiryService chatInquiryService;
    private final ChatReplyService chatReplyService;

    public ChatConversationController(ChatInquiryService chatInquiryService, ChatReplyService chatReplyService) {
        this.chatInquiryService = chatInquiryService;
        this.chatReplyService = chatReplyService;
    }

    /**
     * Record user information when bot asks for names
     * This endpoint is called when the bot asks "Please give us your names."
     */
    @Operation(summary = "Record visitor name and phone from bot conversation")
    @PostMapping("/record-user-info")
    public ResponseEntity<?> recordUserInfo(@RequestBody ChatConversationRequest request) {
        try {
            // Validate request
            if (request == null) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Request body is required"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!StringUtils.hasText(request.getName())) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Name is required"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!StringUtils.hasText(request.getPhoneNumber())) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Phone number is required"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            // Validate phone number format
            String digits = request.getPhoneNumber().replaceAll("\\D", "");
            if (digits.length() < 10) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Phone number must contain at least 10 digits"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            // Create chat inquiry record
            ChatInquiry chatInquiry = new ChatInquiry(
                request.getName(),
                request.getPhoneNumber(),
                "Bot asked for user information - Name provided: " + request.getName(),
                "User provided contact information for follow-up",
                LocalDateTime.now()
            );

            ChatInquiry saved = chatInquiryService.saveInquiry(chatInquiry);

            return new ResponseEntity<>(
                new ApiResponse<>(201, "User information recorded successfully", saved), 
                HttpStatus.CREATED
            );

        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(500, "Unexpected error: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Search for user conversations by name or phone number
     */
    @Operation(summary = "Search conversations by name or phone")
    @GetMapping("/search")
    public ResponseEntity<?> searchConversations(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phoneNumber) {
        try {
            var results = chatInquiryService.search(name, phoneNumber);
            return new ResponseEntity<>(
                new ApiResponse<>(200, "Search completed", results), 
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(500, "Unexpected error: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all conversations with pagination
     */
    @Operation(summary = "List all conversations with pagination")
    @GetMapping("/all")
    public ResponseEntity<?> getAllConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        try {
            var results = chatInquiryService.getAllInquiriesPaginated(page, size);
            return new ResponseEntity<>(
                new ApiResponse<>(200, "All conversations retrieved", results), 
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(500, "Unexpected error: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get conversation statistics
     */
    @Operation(summary = "Get conversation statistics")
    @GetMapping("/statistics")
    public ResponseEntity<?> getConversationStatistics() {
        try {
            var stats = chatInquiryService.getConversationStatistics();
            return new ResponseEntity<>(
                new ApiResponse<>(200, "Statistics retrieved", stats), 
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(500, "Unexpected error: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Send a reply to a conversation
     */
    @Operation(summary = "Post admin reply to a conversation")
    @PostMapping("/reply")
    public ResponseEntity<?> sendReply(@RequestBody ChatReplyRequest request) {
        try {
            // Validate request
            if (request == null) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Request body is required"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            if (request.getConversationId() == null) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Conversation ID is required"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!StringUtils.hasText(request.getReplyMessage())) {
                return new ResponseEntity<>(
                    new ErrorResponse(400, "Reply message is required"), 
                    HttpStatus.BAD_REQUEST
                );
            }

            // Create chat reply
            ChatReply chatReply = new ChatReply(
                request.getConversationId(),
                request.getReplyMessage(),
                request.getRepliedBy() != null ? request.getRepliedBy() : "Admin",
                LocalDateTime.now()
            );

            ChatReply saved = chatReplyService.saveReply(chatReply);

            return new ResponseEntity<>(
                new ApiResponse<>(201, "Reply sent successfully", saved), 
                HttpStatus.CREATED
            );

        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(500, "Unexpected error: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all replies for a conversation
     */
    @Operation(summary = "List replies for a conversation")
    @GetMapping("/{conversationId}/replies")
    public ResponseEntity<?> getConversationReplies(@PathVariable Long conversationId) {
        try {
            var replies = chatReplyService.getRepliesByConversationId(conversationId);
            return new ResponseEntity<>(
                new ApiResponse<>(200, "Replies retrieved successfully", replies), 
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ErrorResponse(500, "Unexpected error: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}


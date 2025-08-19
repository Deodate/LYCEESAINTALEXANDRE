package com.lycee.controller;

import com.lycee.dto.request.ChatInquiryRequest;
import com.lycee.dto.response.ApiResponse;
import com.lycee.dto.response.ErrorResponse;
import com.lycee.entity.ChatInquiry;
import com.lycee.service.ChatInquiryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/chat-inquiries")
public class ChatInquiryController {

    private final ChatInquiryService service;

    public ChatInquiryController(ChatInquiryService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ChatInquiryRequest body) {
        try {
            if (body == null) {
                return new ResponseEntity<>(new ErrorResponse(400, "Request body is required"), HttpStatus.BAD_REQUEST);
            }
            if (!StringUtils.hasText(body.getName())) {
                return new ResponseEntity<>(new ErrorResponse(400, "Name is required"), HttpStatus.BAD_REQUEST);
            }
            if (!StringUtils.hasText(body.getPhoneNumber())) {
                return new ResponseEntity<>(new ErrorResponse(400, "Phone number is required"), HttpStatus.BAD_REQUEST);
            }
            String digits = body.getPhoneNumber().replaceAll("\\D", "");
            if (digits.length() < 10) {
                return new ResponseEntity<>(new ErrorResponse(400, "Phone number must contain at least 10 digits"), HttpStatus.BAD_REQUEST);
            }
            if (!StringUtils.hasText(body.getQuestion())) {
                return new ResponseEntity<>(new ErrorResponse(400, "Question is required"), HttpStatus.BAD_REQUEST);
            }

            ChatInquiry entity = new ChatInquiry(body.getName(), body.getPhoneNumber(), body.getQuestion(), body.getAnswer(), LocalDateTime.now());
            ChatInquiry saved = service.saveInquiry(entity);
            return new ResponseEntity<>(new ApiResponse<>(201, "Inquiry recorded", saved), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(500, "Unexpected error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String name,
                                    @RequestParam(required = false) String phoneNumber) {
        try {
            var results = service.search(name, phoneNumber);
            return new ResponseEntity<>(new ApiResponse<>(200, "OK", results), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(500, "Unexpected error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}



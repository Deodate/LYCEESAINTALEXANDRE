package com.lycee.service;

import com.lycee.entity.ChatInquiry;

public interface ChatInquiryService {
    ChatInquiry saveInquiry(ChatInquiry inquiry);
    java.util.List<ChatInquiry> search(String name, String phone);
}



package com.lycee.service;

import com.lycee.entity.ChatInquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Map;

public interface ChatInquiryService {
    ChatInquiry saveInquiry(ChatInquiry inquiry);
    java.util.List<ChatInquiry> search(String name, String phone);
    java.util.List<ChatInquiry> getAllInquiries();
    Page<ChatInquiry> getAllInquiriesPaginated(int page, int size);
    Map<String, Object> getConversationStatistics();
}



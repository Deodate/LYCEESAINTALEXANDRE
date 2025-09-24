package com.lycee.service.impl;

import com.lycee.entity.ChatInquiry;
import com.lycee.repository.ChatInquiryRepository;
import com.lycee.service.ChatInquiryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatInquiryServiceImpl implements ChatInquiryService {
    private final ChatInquiryRepository repository;

    public ChatInquiryServiceImpl(ChatInquiryRepository repository) {
        this.repository = repository;
    }

    @Override
    public ChatInquiry saveInquiry(ChatInquiry inquiry) {
        return repository.save(inquiry);
    }

    @Override
    public List<ChatInquiry> search(String name, String phone) {
        final String safeName = name == null ? "" : name.trim();
        final String safePhone = phone == null ? "" : phone.trim();
        boolean hasName = !safeName.isEmpty();
        boolean hasPhone = !safePhone.isEmpty();
        if (hasName && hasPhone) {
            return repository.findByNameIgnoreCaseContainingAndPhoneNumberContaining(safeName, safePhone);
        }
        if (hasName) {
            return repository.findByNameIgnoreCaseContaining(safeName);
        }
        if (hasPhone) {
            return repository.findByPhoneNumberContaining(safePhone);
        }
        return List.of();
    }

    @Override
    public List<ChatInquiry> getAllInquiries() {
        return repository.findAll();
    }

    @Override
    public Page<ChatInquiry> getAllInquiriesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repository.findAll(pageable);
    }

    @Override
    public Map<String, Object> getConversationStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total conversations
        long totalConversations = repository.count();
        stats.put("totalConversations", totalConversations);
        
        // This month's conversations
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long thisMonthConversations = repository.countByCreatedAtAfter(startOfMonth);
        stats.put("thisMonthConversations", thisMonthConversations);
        
        // Average response time (mock data for now)
        double avgResponseTime = 2.3;
        stats.put("avgResponseTime", avgResponseTime);
        
        // Satisfaction rating (mock data for now)
        double satisfaction = 4.8;
        stats.put("satisfaction", satisfaction);
        
        return stats;
    }
}



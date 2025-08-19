package com.lycee.service.impl;

import com.lycee.entity.ChatInquiry;
import com.lycee.repository.ChatInquiryRepository;
import com.lycee.service.ChatInquiryService;
import org.springframework.stereotype.Service;
import java.util.List;

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
}



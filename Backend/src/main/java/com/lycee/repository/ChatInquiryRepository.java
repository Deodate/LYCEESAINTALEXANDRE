package com.lycee.repository;

import com.lycee.entity.ChatInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatInquiryRepository extends JpaRepository<ChatInquiry, Long> {
    java.util.List<ChatInquiry> findByPhoneNumberContaining(String phoneNumber);
    java.util.List<ChatInquiry> findByNameIgnoreCaseContaining(String name);
    java.util.List<ChatInquiry> findByNameIgnoreCaseContainingAndPhoneNumberContaining(String name, String phoneNumber);
}



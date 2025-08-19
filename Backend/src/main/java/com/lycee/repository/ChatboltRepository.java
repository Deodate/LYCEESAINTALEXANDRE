package com.lycee.repository;

import com.lycee.entity.Chatbolt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatboltRepository extends JpaRepository<Chatbolt, Long> {
} 
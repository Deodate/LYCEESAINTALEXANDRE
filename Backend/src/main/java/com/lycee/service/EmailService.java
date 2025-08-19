package com.lycee.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String firstName, String lastName, String resetToken);
}

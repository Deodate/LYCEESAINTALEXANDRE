package com.lycee.service;

import com.lycee.entity.User;
import org.springframework.security.core.Authentication;

public interface AuthService {
    User registerUser(User user);
    User signIn(String email, String password);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    void verifyResetToken(String token);
    User getCurrentUser(Authentication authentication);
} 
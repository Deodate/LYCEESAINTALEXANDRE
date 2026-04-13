package com.lycee.service;

import com.lycee.entity.User;
import org.springframework.security.core.Authentication;

public interface AuthService {

    User registerUser(User user);

    void verifyEmail(String token);

    void verifyOtp(String email, String otp);

    /**
     * @return false if no user exists for this email (caller may return 404)
     */
    boolean resendOtp(String email);

    User signIn(String email, String password);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);

    void verifyResetToken(String token);

    User getCurrentUser(Authentication authentication);
}

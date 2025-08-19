package com.lycee.service.impl;

import com.lycee.entity.User;
import com.lycee.repository.UserRepository;
import com.lycee.service.AuthService;
import com.lycee.service.EmailService;
import com.lycee.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.emailService = emailService;
    }

    @Override
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User signIn(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Get the user details from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Generate JWT token
        String jwtToken = jwtUtils.generateJwtToken(authentication);
        
        // Set the token in the user object (you might want to create a separate DTO for this)
        // For now, we'll return the user object and handle the token in the controller
        
        return user;
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String resetToken = UUID.randomUUID().toString();
        // Set token to expire in 24 hours
        Date expiryDate = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);

        user.setResetToken(resetToken);
        user.setResetTokenExpiryDate(expiryDate);
        userRepository.save(user);

        // Send email using EmailService
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), user.getLastName(), resetToken);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        // Check if token has expired
        if (user.getResetTokenExpiryDate().before(new Date())) {
            throw new RuntimeException("Reset token has expired");
        }

        // Update password and clear reset token
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiryDate(null);
        userRepository.save(user);
    }

    @Override
    public void verifyResetToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        // Check if token has expired
        if (user.getResetTokenExpiryDate().before(new Date())) {
            throw new RuntimeException("Reset token has expired");
        }
    }

    @Override
    public User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
} 
package com.lycee.service.impl;

import com.lycee.entity.User;
import com.lycee.repository.UserRepository;
import com.lycee.service.AuthService;
import com.lycee.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final long VERIFICATION_TOKEN_VALIDITY_MS = 48L * 60 * 60 * 1000;
    private static final long VERIFICATION_OTP_VALIDITY_MS = 10L * 60 * 1000;

    private final SecureRandom secureRandom = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false);
        String token = UUID.randomUUID().toString();
        String otp = generateOtp();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(new Date(System.currentTimeMillis() + VERIFICATION_TOKEN_VALIDITY_MS));
        user.setVerificationOtp(otp);
        user.setVerificationOtpExpiry(new Date(System.currentTimeMillis() + VERIFICATION_OTP_VALIDITY_MS));
        User saved = userRepository.save(user);
        emailService.sendVerificationEmail(saved.getEmail(), saved.getFirstName(), saved.getLastName(), token, otp);
        return saved;
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or unknown verification token"));
        if (user.getVerificationTokenExpiry() != null && user.getVerificationTokenExpiry().before(new Date())) {
            throw new RuntimeException("Verification token has expired");
        }
        activateVerifiedUser(user);
    }

    @Override
    @Transactional
    public void verifyOtp(String email, String rawOtp) {
        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification code"));
        if (user.isEnabled()) {
            throw new IllegalArgumentException("Account is already verified");
        }
        String otp = rawOtp == null ? "" : rawOtp.replaceAll("\\s+", "").trim();
        if (otp.length() != 6 || !otp.chars().allMatch(Character::isDigit)) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        if (user.getVerificationOtp() == null || user.getVerificationOtpExpiry() == null) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        if (user.getVerificationOtpExpiry().before(new Date())) {
            throw new IllegalArgumentException("OTP expired, please request a new one");
        }
        if (!constantTimeOtpEquals(user.getVerificationOtp(), otp)) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        activateVerifiedUser(user);
    }

    @Override
    @Transactional
    public boolean resendOtp(String email) {
        Optional<User> opt = userRepository.findByEmail(email.trim());
        if (opt.isEmpty()) {
            return false;
        }
        User user = opt.get();
        if (user.isEnabled()) {
            throw new IllegalArgumentException("Account is already verified");
        }
        String token = UUID.randomUUID().toString();
        String otp = generateOtp();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(new Date(System.currentTimeMillis() + VERIFICATION_TOKEN_VALIDITY_MS));
        user.setVerificationOtp(otp);
        user.setVerificationOtpExpiry(new Date(System.currentTimeMillis() + VERIFICATION_OTP_VALIDITY_MS));
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), user.getLastName(), token, otp);
        return true;
    }

    private void activateVerifiedUser(User user) {
        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        user.setVerificationOtp(null);
        user.setVerificationOtpExpiry(null);
        userRepository.save(user);
    }

    private String generateOtp() {
        int n = secureRandom.nextInt(1_000_000);
        return String.format("%06d", n);
    }

    private static boolean constantTimeOtpEquals(String expected, String actual) {
        if (expected == null || actual == null) {
            return false;
        }
        byte[] a = expected.getBytes(StandardCharsets.UTF_8);
        byte[] b = actual.getBytes(StandardCharsets.UTF_8);
        if (a.length != b.length) {
            return false;
        }
        return MessageDigest.isEqual(a, b);
    }

    @Override
    public User signIn(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String resetToken = UUID.randomUUID().toString();
        Date expiryDate = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);

        user.setResetToken(resetToken);
        user.setResetTokenExpiryDate(expiryDate);
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), user.getLastName(), resetToken);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiryDate() == null || user.getResetTokenExpiryDate().before(new Date())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiryDate(null);
        userRepository.save(user);
    }

    @Override
    public void verifyResetToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiryDate() == null || user.getResetTokenExpiryDate().before(new Date())) {
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

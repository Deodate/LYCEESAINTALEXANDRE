package com.lycee.service.impl;

import com.lycee.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Objects;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String fromEmail;
    private final String frontendUrl;
    private final String apiPublicUrl;
    private final String verificationFrontendPath;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            TemplateEngine templateEngine,
            @Value("${spring.mail.username}") String fromEmail,
            @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl,
            @Value("${app.api.public-url:http://localhost:9090}") String apiPublicUrl,
            @Value("${app.email.verification-frontend-path:/verify-email}") String verificationFrontendPath) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.fromEmail = Objects.requireNonNull(fromEmail, "spring.mail.username must be set");
        this.frontendUrl = Objects.requireNonNull(frontendUrl);
        this.apiPublicUrl = Objects.requireNonNull(apiPublicUrl);
        this.verificationFrontendPath = Objects.requireNonNull(verificationFrontendPath);
    }

    @Override
    public void sendPasswordResetEmail(String to, String firstName, String lastName, String resetToken) {
        Objects.requireNonNull(to, "to");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(Objects.requireNonNull(fromEmail, "fromEmail"));
            helper.setTo(to);
            helper.setSubject("Password Reset Request - Lycée Saint Alexandre Sauli de Muhura");

            // Create Thymeleaf context
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("lastName", lastName);
            context.setVariable("resetLink", frontendUrl + "/reset-password?token=" + resetToken);

            // Process the HTML template
            String htmlContent = Objects.requireNonNull(
                    templateEngine.process("password-reset-email", context), "email template output");
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    public void sendVerificationEmail(String to, String firstName, String lastName, String verificationToken, String otpCode) {
        Objects.requireNonNull(to, "to");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(Objects.requireNonNull(fromEmail, "fromEmail"));
            helper.setTo(to);
            helper.setSubject("Your verification code - Lycée Saint Alexandre Sauli de Muhura");

            String frontendLink = frontendUrl + verificationFrontendPath + "?token=" + verificationToken;
            String apiLink = apiPublicUrl + "/api/v1/auth/verify?token=" + verificationToken;

            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("lastName", lastName);
            context.setVariable("verifyLink", frontendLink);
            context.setVariable("apiVerifyLink", apiLink);
            context.setVariable("otpCode", otpCode);

            String htmlContent = Objects.requireNonNull(
                    templateEngine.process("email-verification", context), "email template output");
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}

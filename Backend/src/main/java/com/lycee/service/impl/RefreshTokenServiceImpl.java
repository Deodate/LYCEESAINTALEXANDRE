package com.lycee.service.impl;

import com.lycee.dto.response.JwtResponse;
import com.lycee.entity.RefreshToken;
import com.lycee.entity.User;
import com.lycee.exception.InvalidRefreshTokenException;
import com.lycee.repository.RefreshTokenRepository;
import com.lycee.security.JwtUtils;
import com.lycee.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Value("${lycee.app.refreshTokenExpirationMs}")
    private long refreshTokenExpirationMs;

    @Value("${lycee.app.auth.single-session-on-signin:false}")
    private boolean singleSessionOnSignin;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository,
                                   JwtUtils jwtUtils,
                                   UserDetailsService userDetailsService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    @Transactional
    public String issueRefreshTokenForUser(User user) {
        if (singleSessionOnSignin) {
            refreshTokenRepository.deleteByUser_Id(user.getId());
        }
        String plain = newPlainToken();
        LocalDateTime expiresAt = LocalDateTime.now().plus(refreshTokenExpirationMs, ChronoUnit.MILLIS);
        refreshTokenRepository.save(new RefreshToken(user, plain, expiresAt));
        return plain;
    }

    @Override
    @Transactional
    public JwtResponse rotate(String refreshTokenPlain) {
        RefreshToken existing = refreshTokenRepository.findByToken(refreshTokenPlain)
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token not found"));

        if (existing.isRevoked()) {
            throw new InvalidRefreshTokenException("Refresh token has been revoked");
        }
        if (existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidRefreshTokenException("Refresh token has expired");
        }

        User user = existing.getUser();
        refreshTokenRepository.delete(existing);

        String newPlain = newPlainToken();
        LocalDateTime expiresAt = LocalDateTime.now().plus(refreshTokenExpirationMs, ChronoUnit.MILLIS);
        refreshTokenRepository.save(new RefreshToken(user, newPlain, expiresAt));

        Authentication authentication = buildAuthentication(user.getEmail());
        String accessJwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponse(accessJwt, newPlain, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());
    }

    @Override
    @Transactional
    public void revoke(String refreshTokenPlain) {
        refreshTokenRepository.findByToken(refreshTokenPlain).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private Authentication buildAuthentication(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    private static String newPlainToken() {
        return UUID.randomUUID().toString();
    }
}

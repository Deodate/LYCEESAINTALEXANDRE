package com.lycee.service;

import com.lycee.dto.response.JwtResponse;
import com.lycee.entity.User;

public interface RefreshTokenService {

    String issueRefreshTokenForUser(User user);

    JwtResponse rotate(String refreshTokenPlain);

    void revoke(String refreshTokenPlain);
}

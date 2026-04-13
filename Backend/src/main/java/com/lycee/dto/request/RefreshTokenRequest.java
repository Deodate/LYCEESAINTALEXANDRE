package com.lycee.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Opaque refresh token issued at sign-in or last refresh")
public class RefreshTokenRequest {

    @NotBlank
    @Schema(example = "8f0e2c1a-4b3d-4e5f-9a0b-1c2d3e4f5a6b")
    private String refreshToken;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}

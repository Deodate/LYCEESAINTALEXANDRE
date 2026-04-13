package com.lycee.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Access JWT (short-lived) and opaque refresh token")
public class JwtResponse {

    @Schema(description = "Bearer access JWT", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Opaque refresh token; store securely on the client", example = "8f0e2c1a-4b3d-4e5f-9a0b-1c2d3e4f5a6b")
    private String refreshToken;

    @Schema(example = "Bearer")
    private String type = "Bearer";

    private Long id;
    private String email;
    private String firstName;
    private String lastName;

    public JwtResponse(String accessToken, String refreshToken, Long id, String email, String firstName, String lastName) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}

package com.lycee.dto.response;

/**
 * Standard API error body: {@code { "status": <code>, "message": "<text>" }}
 * (Same shape as {@link com.lycee.security.AuthEntryPointJwt} for 401s.)
 */
public class ErrorResponse {
    private int status;
    private String message;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}

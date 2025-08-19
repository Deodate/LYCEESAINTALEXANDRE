package com.lycee.dto.response;

public class ErrorResponse {
    private int status;
    private String error;

    public ErrorResponse(int status, String error) {
        this.status = status;
        this.error = error;
    }

    // Getters
    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }
} 
package com.lycee.dto.response;

public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;

    public ApiResponse(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(boolean success, String message, T data) {
        this.status = success ? 200 : 400;
        this.message = message;
        this.data = data;
    }

    // Getters
    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
} 
package com.lycee.dto.response;

import java.util.Date;

public class BabyeyiPdfResponse {

    private Long id;
    private String title;
    private String content;
    private String fileName;
    private Long fileSize;
    private Date createdAt;
    private Date updatedAt;
    private String status;
    private String userEmail;

    public BabyeyiPdfResponse() {
    }

    public BabyeyiPdfResponse(Long id, String title, String content, String fileName, 
                             Long fileSize, Date createdAt, Date updatedAt, 
                             String status, String userEmail) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
        this.userEmail = userEmail;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}


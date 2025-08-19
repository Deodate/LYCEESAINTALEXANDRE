package com.lycee.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "babyeyi_pdfs")
public class BabyeyiPdf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "pdf_data", columnDefinition = "TEXT")
    private String pdfData; // Base64 encoded PDF data

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "status")
    private String status = "ACTIVE"; // ACTIVE, DELETED, ARCHIVED

    // Constructors
    public BabyeyiPdf() {
        this.createdAt = new Date();
    }

    public BabyeyiPdf(String title, String content, String pdfData, String fileName, User user) {
        this.title = title;
        this.content = content;
        this.pdfData = pdfData;
        this.fileName = fileName;
        this.user = user;
        this.createdAt = new Date();
        this.fileSize = pdfData != null ? (long) pdfData.length() : 0L;
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

    public String getPdfData() {
        return pdfData;
    }

    public void setPdfData(String pdfData) {
        this.pdfData = pdfData;
        this.fileSize = pdfData != null ? (long) pdfData.length() : 0L;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }
}

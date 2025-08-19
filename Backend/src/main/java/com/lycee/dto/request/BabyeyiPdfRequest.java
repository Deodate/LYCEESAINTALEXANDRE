package com.lycee.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BabyeyiPdfRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "PDF data is required")
    private String pdfData;

    private String fileName;

    public BabyeyiPdfRequest() {
    }

    public BabyeyiPdfRequest(String title, String content, String pdfData, String fileName) {
        this.title = title;
        this.content = content;
        this.pdfData = pdfData;
        this.fileName = fileName;
    }

    // Getters and Setters
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
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}


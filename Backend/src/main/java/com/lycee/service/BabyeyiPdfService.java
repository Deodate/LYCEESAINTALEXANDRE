package com.lycee.service;

import com.lycee.dto.request.BabyeyiPdfRequest;
import com.lycee.dto.response.BabyeyiPdfResponse;
import com.lycee.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BabyeyiPdfService {

    // Create a new PDF
    BabyeyiPdfResponse createPdf(BabyeyiPdfRequest request, User user);

    // Get PDF by ID
    Optional<BabyeyiPdfResponse> getPdfById(Long id);

    // Get PDF by ID and user
    Optional<BabyeyiPdfResponse> getPdfByIdAndUser(Long id, User user);

    // Get all PDFs by user
    List<BabyeyiPdfResponse> getPdfsByUser(User user);

    // Get all PDFs by user with pagination
    Page<BabyeyiPdfResponse> getPdfsByUser(User user, Pageable pageable);

    // Get all active PDFs by user
    List<BabyeyiPdfResponse> getActivePdfsByUser(User user);

    // Search PDFs by title
    List<BabyeyiPdfResponse> searchPdfsByTitle(String title);

    // Search PDFs by title and user
    List<BabyeyiPdfResponse> searchPdfsByTitleAndUser(String title, User user);

    // Get all active PDFs
    List<BabyeyiPdfResponse> getAllActivePdfs();

    // Update PDF
    Optional<BabyeyiPdfResponse> updatePdf(Long id, BabyeyiPdfRequest request, User user);

    // Delete PDF (soft delete)
    boolean deletePdf(Long id, User user);

    // Permanently delete PDF
    boolean permanentlyDeletePdf(Long id, User user);

    // Get PDF count by user
    long getPdfCountByUser(User user);

    // Get active PDF count by user
    long getActivePdfCountByUser(User user);

    // Get PDF data for download
    Optional<String> getPdfDataById(Long id, User user);

    // Get latest active PDF (public endpoint)
    Optional<BabyeyiPdfResponse> getLatestActivePdf();

    // Get latest active PDF data for download (public endpoint)
    Optional<String> getLatestActivePdfData();
}

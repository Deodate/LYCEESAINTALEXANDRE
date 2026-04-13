package com.lycee.service.impl;

import com.lycee.dto.request.BabyeyiPdfRequest;
import com.lycee.dto.response.BabyeyiPdfResponse;
import com.lycee.entity.BabyeyiPdf;
import com.lycee.entity.User;
import com.lycee.repository.BabyeyiPdfRepository;
import com.lycee.service.BabyeyiPdfService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BabyeyiPdfServiceImpl implements BabyeyiPdfService {

    private final BabyeyiPdfRepository babyeyiPdfRepository;

    public BabyeyiPdfServiceImpl(BabyeyiPdfRepository babyeyiPdfRepository) {
        this.babyeyiPdfRepository = babyeyiPdfRepository;
    }

    @Override
    public BabyeyiPdfResponse createPdf(BabyeyiPdfRequest request, User user) {
        BabyeyiPdf pdf = new BabyeyiPdf(
            request.getTitle(),
            request.getContent(),
            request.getPdfData(),
            request.getFileName() != null ? request.getFileName() : "babyeyi_letter.pdf",
            user
        );
        
        BabyeyiPdf savedPdf = babyeyiPdfRepository.save(pdf);
        return convertToResponse(savedPdf);
    }

    @Override
    public Optional<BabyeyiPdfResponse> getPdfById(Long id) {
        return babyeyiPdfRepository.findByIdAndStatus(id, "ACTIVE")
                .map(this::convertToResponse);
    }

    @Override
    public Optional<BabyeyiPdfResponse> getPdfByIdAndUser(Long id, User user) {
        return babyeyiPdfRepository.findByIdAndUser(id, user)
                .map(this::convertToResponse);
    }

    @Override
    public List<BabyeyiPdfResponse> getPdfsByUser(User user) {
        return babyeyiPdfRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public Page<BabyeyiPdfResponse> getPdfsByUser(User user, Pageable pageable) {
        return babyeyiPdfRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::convertToResponse);
    }

    @Override
    public List<BabyeyiPdfResponse> getActivePdfsByUser(User user) {
        return babyeyiPdfRepository.findByUserAndStatusOrderByCreatedAtDesc(user, "ACTIVE")
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<BabyeyiPdfResponse> searchPdfsByTitle(String title) {
        return babyeyiPdfRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(title)
                .stream()
                .filter(pdf -> "ACTIVE".equals(pdf.getStatus()))
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<BabyeyiPdfResponse> searchPdfsByTitleAndUser(String title, User user) {
        return babyeyiPdfRepository.findByUserAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(user, title)
                .stream()
                .filter(pdf -> "ACTIVE".equals(pdf.getStatus()))
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<BabyeyiPdfResponse> getAllActivePdfs() {
        return babyeyiPdfRepository.findByStatusOrderByCreatedAtDesc("ACTIVE")
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public Optional<BabyeyiPdfResponse> updatePdf(Long id, BabyeyiPdfRequest request, User user) {
        // First try to find PDF by ID and user (user-owned PDF)
        Optional<BabyeyiPdf> pdfOptional = babyeyiPdfRepository.findByIdAndUser(id, user);
        
        // If not found, try to find by ID only (for PDFs without user association)
        if (pdfOptional.isEmpty()) {
            pdfOptional = babyeyiPdfRepository.findByIdAndStatus(id, "ACTIVE");
            
            // If found but has no user, assign it to the current user
            if (pdfOptional.isPresent() && pdfOptional.get().getUser() == null) {
                BabyeyiPdf pdf = pdfOptional.get();
                pdf.setUser(user);
                babyeyiPdfRepository.save(pdf);
            }
        }
        
        return pdfOptional.map(pdf -> {
            pdf.setTitle(request.getTitle());
            pdf.setContent(request.getContent());
            pdf.setPdfData(request.getPdfData());
            if (request.getFileName() != null) {
                pdf.setFileName(request.getFileName());
            }
            return convertToResponse(babyeyiPdfRepository.save(pdf));
        });
    }

    @Override
    public boolean deletePdf(Long id, User user) {
        return babyeyiPdfRepository.findByIdAndUser(id, user)
                .map(pdf -> {
                    pdf.setStatus("DELETED");
                    babyeyiPdfRepository.save(pdf);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public boolean permanentlyDeletePdf(Long id, User user) {
        return babyeyiPdfRepository.findByIdAndUser(id, user)
                .map(pdf -> {
                    babyeyiPdfRepository.delete(Objects.requireNonNull(pdf));
                    return true;
                })
                .orElse(false);
    }

    @Override
    public long getPdfCountByUser(User user) {
        return babyeyiPdfRepository.countByUser(user);
    }

    @Override
    public long getActivePdfCountByUser(User user) {
        return babyeyiPdfRepository.countByUserAndStatus(user, "ACTIVE");
    }

    @Override
    public Optional<String> getPdfDataById(Long id, User user) {
        return babyeyiPdfRepository.findByIdAndUser(id, user)
                .map(BabyeyiPdf::getPdfData);
    }

    @Override
    public Optional<BabyeyiPdfResponse> getLatestActivePdf() {
        return babyeyiPdfRepository.findFirstByStatusOrderByCreatedAtDesc("ACTIVE")
                .map(this::convertToResponse);
    }

    @Override
    public Optional<String> getLatestActivePdfData() {
        return babyeyiPdfRepository.findFirstByStatusOrderByCreatedAtDesc("ACTIVE")
                .map(BabyeyiPdf::getPdfData);
    }

    private BabyeyiPdfResponse convertToResponse(BabyeyiPdf pdf) {
        return new BabyeyiPdfResponse(
            pdf.getId(),
            pdf.getTitle(),
            pdf.getContent(),
            pdf.getFileName(),
            pdf.getFileSize(),
            pdf.getCreatedAt(),
            pdf.getUpdatedAt(),
            pdf.getStatus(),
            pdf.getUser() != null ? pdf.getUser().getEmail() : null
        );
    }
}

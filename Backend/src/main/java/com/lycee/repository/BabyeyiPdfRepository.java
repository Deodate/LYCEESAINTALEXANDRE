package com.lycee.repository;

import com.lycee.entity.BabyeyiPdf;
import com.lycee.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BabyeyiPdfRepository extends JpaRepository<BabyeyiPdf, Long> {

    // Find all PDFs by user
    List<BabyeyiPdf> findByUserOrderByCreatedAtDesc(User user);

    // Find all PDFs by user with pagination
    Page<BabyeyiPdf> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    // Find all active PDFs by user
    List<BabyeyiPdf> findByUserAndStatusOrderByCreatedAtDesc(User user, String status);

    // Find PDF by title (case insensitive)
    List<BabyeyiPdf> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);

    // Find PDFs by user and title
    List<BabyeyiPdf> findByUserAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(User user, String title);

    // Find all active PDFs
    List<BabyeyiPdf> findByStatusOrderByCreatedAtDesc(String status);

    // Count PDFs by user
    long countByUser(User user);

    // Count active PDFs by user
    long countByUserAndStatus(User user, String status);

    // Find PDF by ID and user
    Optional<BabyeyiPdf> findByIdAndUser(Long id, User user);

    // Find PDF by ID and status
    Optional<BabyeyiPdf> findByIdAndStatus(Long id, String status);

    // Custom query to find PDFs with user information
    @Query("SELECT p FROM BabyeyiPdf p WHERE p.user.email = :userEmail AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<BabyeyiPdf> findActivePdfsByUserEmail(@Param("userEmail") String userEmail);

    // Custom query to find recent PDFs
    @Query("SELECT p FROM BabyeyiPdf p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<BabyeyiPdf> findRecentActivePdfs(Pageable pageable);

    // Find the latest active PDF
    Optional<BabyeyiPdf> findFirstByStatusOrderByCreatedAtDesc(String status);
}

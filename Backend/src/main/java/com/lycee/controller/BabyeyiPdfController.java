package com.lycee.controller;

import com.lycee.config.OpenApiConfig;
import com.lycee.dto.request.BabyeyiPdfRequest;
import com.lycee.dto.response.ApiResponse;
import com.lycee.dto.response.BabyeyiPdfResponse;
import com.lycee.entity.User;
import com.lycee.service.BabyeyiPdfService;
import com.lycee.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/babyeyi-pdf")
@CrossOrigin(origins = "*")
@Tag(name = "2. Babyeyi")
public class BabyeyiPdfController {

    @Autowired
    private BabyeyiPdfService babyeyiPdfService;

    @Autowired
    private AuthService authService;

    // Create a new PDF - Requires authentication
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Create PDF for authenticated user")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<BabyeyiPdfResponse>> createPdf(
            @Valid @RequestBody BabyeyiPdfRequest request,
            Authentication authentication) {
        try {
            // Check if user is authenticated
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authentication required to create PDF", null));
            }
            
            // Get authenticated user
            User user = authService.getCurrentUser(authentication);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid authentication token", null));
            }
            
            System.out.println("Authenticated user creating PDF: " + user.getEmail());
            
            BabyeyiPdfResponse response = babyeyiPdfService.createPdf(request, user);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "PDF created successfully", 
                response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to create PDF: " + e.getMessage(), null));
        }
    }

    // Update existing PDF - Requires authentication
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Update PDF by id")
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<BabyeyiPdfResponse>> updatePdf(
            @PathVariable Long id,
            @Valid @RequestBody BabyeyiPdfRequest request,
            Authentication authentication) {
        try {
            // Check if user is authenticated
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authentication required to update PDF", null));
            }
            
            // Get authenticated user
            User user = authService.getCurrentUser(authentication);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid authentication token", null));
            }
            
            System.out.println("Authenticated user updating PDF: " + user.getEmail());
            
            Optional<BabyeyiPdfResponse> pdfResponse = babyeyiPdfService.updatePdf(id, request, user);
            
            if (pdfResponse.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "PDF updated successfully", 
                    pdfResponse.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "PDF not found or access denied", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to update PDF: " + e.getMessage(), null));
        }
    }

    // Get PDF by ID
    @Operation(summary = "Get PDF metadata by id (public)")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BabyeyiPdfResponse>> getPdfById(@PathVariable Long id) {
        try {
            Optional<BabyeyiPdfResponse> pdf = babyeyiPdfService.getPdfById(id);
            if (pdf.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "PDF retrieved successfully", 
                    pdf.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "PDF not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve PDF: " + e.getMessage(), null));
        }
    }

    // Get PDF by ID for current user
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Get current user's PDF by id")
    @GetMapping("/my/{id}")
    public ResponseEntity<ApiResponse<BabyeyiPdfResponse>> getMyPdfById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            Optional<BabyeyiPdfResponse> pdf = babyeyiPdfService.getPdfByIdAndUser(id, user);
            if (pdf.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "PDF retrieved successfully", 
                    pdf.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "PDF not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve PDF: " + e.getMessage(), null));
        }
    }

    // Get all PDFs for current user
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "List current user's PDFs")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BabyeyiPdfResponse>>> getMyPdfs(Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            List<BabyeyiPdfResponse> pdfs = babyeyiPdfService.getActivePdfsByUser(user);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "PDFs retrieved successfully", 
                pdfs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve PDFs: " + e.getMessage(), null));
        }
    }

    // Get all PDFs for current user with pagination
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "List current user's PDFs with pagination")
    @GetMapping("/my/paginated")
    public ResponseEntity<ApiResponse<Page<BabyeyiPdfResponse>>> getMyPdfsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            Pageable pageable = PageRequest.of(page, size);
            Page<BabyeyiPdfResponse> pdfs = babyeyiPdfService.getPdfsByUser(user, pageable);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "PDFs retrieved successfully", 
                pdfs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve PDFs: " + e.getMessage(), null));
        }
    }

    // Search PDFs by title
    @Operation(summary = "Search PDFs by title (public)")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BabyeyiPdfResponse>>> searchPdfs(
            @RequestParam String title) {
        try {
            List<BabyeyiPdfResponse> pdfs = babyeyiPdfService.searchPdfsByTitle(title);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "PDFs found successfully", 
                pdfs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to search PDFs: " + e.getMessage(), null));
        }
    }

    // Search PDFs by title for current user
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Search current user's PDFs by title")
    @GetMapping("/my/search")
    public ResponseEntity<ApiResponse<List<BabyeyiPdfResponse>>> searchMyPdfs(
            @RequestParam String title,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            List<BabyeyiPdfResponse> pdfs = babyeyiPdfService.searchPdfsByTitleAndUser(title, user);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "PDFs found successfully", 
                pdfs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to search PDFs: " + e.getMessage(), null));
        }
    }

    // Delete PDF (soft delete)
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Soft-delete PDF by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePdf(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            boolean deleted = babyeyiPdfService.deletePdf(id, user);
            
            if (deleted) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "PDF deleted successfully", 
                    "PDF with ID " + id + " has been deleted"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "PDF not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to delete PDF: " + e.getMessage(), null));
        }
    }

    // Get PDF data for download
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Get PDF payload for download (authenticated owner)")
    @GetMapping("/{id}/download")
    public ResponseEntity<ApiResponse<String>> downloadPdf(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            Optional<String> pdfData = babyeyiPdfService.getPdfDataById(id, user);
            
            if (pdfData.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "PDF data retrieved successfully", 
                    pdfData.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "PDF not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve PDF data: " + e.getMessage(), null));
        }
    }

    // Get PDF count for current user
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @Operation(summary = "Count active PDFs for current user")
    @GetMapping("/my/count")
    public ResponseEntity<ApiResponse<Long>> getMyPdfCount(Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication);
            long count = babyeyiPdfService.getActivePdfCountByUser(user);
            
            return ResponseEntity.ok(new ApiResponse<>(
                true, 
                "PDF count retrieved successfully", 
                count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve PDF count: " + e.getMessage(), null));
        }
    }

    // Public endpoint to get the latest PDF (no authentication required)
    @Operation(summary = "Get latest active PDF (public)")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<BabyeyiPdfResponse>> getLatestPdf() {
        try {
            Optional<BabyeyiPdfResponse> latestPdf = babyeyiPdfService.getLatestActivePdf();
            
            if (latestPdf.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "Latest PDF retrieved successfully", 
                    latestPdf.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "No PDFs found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve latest PDF: " + e.getMessage(), null));
        }
    }

    // Public endpoint to get the latest PDF data for download (no authentication required)
    @Operation(summary = "Get latest PDF data for download (public)")
    @GetMapping("/latest/download")
    public ResponseEntity<ApiResponse<String>> downloadLatestPdf() {
        try {
            Optional<String> latestPdfData = babyeyiPdfService.getLatestActivePdfData();
            
            if (latestPdfData.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                    true, 
                    "Latest PDF data retrieved successfully", 
                    latestPdfData.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "No PDFs found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve latest PDF data: " + e.getMessage(), null));
        }
    }
}

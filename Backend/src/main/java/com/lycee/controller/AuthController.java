package com.lycee.controller;

import com.lycee.config.OpenApiConfig;
import com.lycee.dto.request.ForgotPasswordRequest;
import com.lycee.dto.request.ResendOtpRequest;
import com.lycee.dto.request.VerifyOtpRequest;
import com.lycee.dto.request.RefreshTokenRequest;
import com.lycee.dto.request.ResetPasswordRequest;
import com.lycee.dto.request.SigninRequest;
import com.lycee.dto.request.SignupRequest;
import com.lycee.dto.response.ApiResponse;
import com.lycee.dto.response.ErrorResponse;
import com.lycee.dto.response.JwtResponse;
import com.lycee.entity.User;
import com.lycee.exception.InvalidRefreshTokenException;
import com.lycee.mapper.UserMapper;
import com.lycee.security.JwtUtils;
import com.lycee.service.AuthService;
import com.lycee.service.RefreshTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "1. Authentication")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Autowired
    public AuthController(AuthService authService, UserMapper userMapper, JwtUtils jwtUtils,
                          RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.userMapper = userMapper;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    @Operation(
            summary = "Register new user account (email verification required before sign-in)",
            description = "Sends a 6-digit OTP and optional verification link. Complete sign-up with POST /api/v1/auth/verify-otp, or use GET /api/v1/auth/verify?token=... / the email link."
    )
    @PostMapping("/signup")
    public ResponseEntity<Object> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User user = userMapper.toEntity(signupRequest);
            User registeredUser = authService.registerUser(user);
            registeredUser.setPassword(null);
            registeredUser.setVerificationToken(null);
            registeredUser.setVerificationTokenExpiry(null);
            registeredUser.setVerificationOtp(null);
            registeredUser.setVerificationOtpExpiry(null);
            ApiResponse<User> response = new ApiResponse<>(HttpStatus.CREATED.value(),
                    "Registration successful. Check your email for a 6-digit code, then use POST /api/v1/auth/verify-otp to activate your account.",
                    registeredUser);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.CONFLICT.value(), "Email already exists");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Sign in — receive short-lived access JWT and refresh token",
            description = "Tokens are in the wrapped data object (accessToken, refreshToken). "
                    + "Set lycee.app.auth.single-session-on-signin=true to revoke prior refresh sessions for this user before issuing a new token (single active session).",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "Authenticated",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Account disabled (e.g. email not verified)")
            }
    )
    @PostMapping("/signin")
    public ResponseEntity<Object> authenticateUser(@Valid @RequestBody SigninRequest signinRequest) {
        try {
            User user = authService.signIn(signinRequest.getEmail(), signinRequest.getPassword());

            String jwt = jwtUtils.generateJwtToken(SecurityContextHolder.getContext().getAuthentication());
            String refreshPlain = refreshTokenService.issueRefreshTokenForUser(user);

            JwtResponse jwtResponse = new JwtResponse(
                    jwt,
                    refreshPlain,
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName()
            );

            ApiResponse<JwtResponse> response = new ApiResponse<>(HttpStatus.OK.value(), "User authenticated successfully", jwtResponse);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (DisabledException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.FORBIDDEN.value(),
                    "Please verify your email before signing in. Use the 6-digit code from your email (POST /api/v1/auth/verify-otp) or the verification link.");
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        } catch (BadCredentialsException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Invalid email or password");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Verify email with OTP (primary)",
            security = {},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = VerifyOtpRequest.class))),
            description = "Submit the 6-digit code from the verification email together with the same email used at sign-up."
    )
    @PostMapping("/verify-otp")
    public ResponseEntity<Object> verifyOtp(@Valid @RequestBody VerifyOtpRequest body) {
        try {
            authService.verifyOtp(body.getEmail(), body.getOtp());
            ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Email verified. You can now sign in.", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Resend verification OTP",
            security = {},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = ResendOtpRequest.class))),
            description = "Sends a new 6-digit code if the account exists and is not yet verified. Returns 404 if the email is not registered."
    )
    @PostMapping("/resend-otp")
    public ResponseEntity<Object> resendOtp(@Valid @RequestBody ResendOtpRequest body) {
        try {
            boolean sent = authService.resendOtp(body.getEmail());
            if (!sent) {
                ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "No account found for this email");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(),
                    "A new verification code has been sent to your email.",
                    null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Verify email with link token (optional)",
            security = {},
            description = "Plain JSON response (no redirect). Optional alternative to POST /verify-otp."
    )
    @GetMapping("/verify")
    public ResponseEntity<Object> verifyEmail(@RequestParam String token) {
        try {
            authService.verifyEmail(token);
            ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Email verified. You can now sign in.", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Refresh access token (rotates refresh token)",
            security = {},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = RefreshTokenRequest.class))),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                            responseCode = "200",
                            description = "New access and refresh tokens",
                            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Refresh token invalid, revoked, or expired"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    @PostMapping("/refresh")
    public ResponseEntity<Object> refresh(@Valid @RequestBody RefreshTokenRequest body) {
        try {
            JwtResponse tokens = refreshTokenService.rotate(body.getRefreshToken());
            ApiResponse<JwtResponse> response = new ApiResponse<>(HttpStatus.OK.value(), "Tokens refreshed", tokens);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (InvalidRefreshTokenException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(
            summary = "Sign out — revoke refresh token",
            security = {},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = RefreshTokenRequest.class))),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Refresh token revoked or unknown token ignored"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    @PostMapping("/signout")
    public ResponseEntity<ApiResponse<String>> signOut(@Valid @RequestBody RefreshTokenRequest body) {
        refreshTokenService.revoke(body.getRefreshToken());
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Signed out successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Request password reset email")
    @PostMapping("/forgot-password")
    public ResponseEntity<Object> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        try {
            authService.forgotPassword(forgotPasswordRequest.getEmail());
            ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Password reset email sent successfully", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Complete password reset with token")
    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            if (!resetPasswordRequest.getNewPassword().equals(resetPasswordRequest.getConfirmPassword())) {
                ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Passwords do not match");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            if (resetPasswordRequest.getNewPassword().length() < 6) {
                ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Password must be at least 6 characters long");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            authService.resetPassword(resetPasswordRequest.getToken(), resetPasswordRequest.getNewPassword());
            ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Password reset successfully", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Verify password reset token is valid")
    @GetMapping("/verify-token/{token}")
    public ResponseEntity<Object> verifyResetToken(@PathVariable String token) {
        try {
            authService.verifyResetToken(token);
            ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Token is valid", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Verify JWT and return current user profile")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @GetMapping("/test-auth")
    public ResponseEntity<Object> testAuthentication(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Not authenticated");
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
            }

            User user = authService.getCurrentUser(authentication);
            Map<String, String> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());

            ApiResponse<Map<String, String>> response = new ApiResponse<>(HttpStatus.OK.value(), "Authentication successful", userData);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Authentication test failed: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Sign out (client discards JWT only — use POST /signout to revoke refresh token)")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser() {
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Logged out successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        String errorMessage = errors.isEmpty() ? "Validation error" : errors.values().iterator().next();
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), errorMessage);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}

# Forgot Password API Implementation

This document describes the complete forgot password functionality implemented in the Lycée Saint Alexandre Sauli de Muhura backend.

## Overview

The forgot password system allows users to reset their passwords securely through email verification. The system includes:

1. **Forgot Password Request** - User requests password reset via email
2. **Email Notification** - System sends HTML email with reset link
3. **Token Verification** - Frontend can verify token validity
4. **Password Reset** - User sets new password using valid token

## API Endpoints

### 1. Forgot Password Request

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Password reset email sent successfully",
  "data": null
}
```

### 2. Verify Reset Token

**Endpoint:** `GET /api/v1/auth/verify-token/{token}`

**Response:**
```json
{
  "status": 200,
  "message": "Token is valid",
  "data": null
}
```

### 3. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Password reset successfully",
  "data": null
}
```

## Implementation Details

### Database Schema

The `users` table includes these fields for password reset:
- `reset_token` - UUID token for password reset
- `reset_token_expiry_date` - Token expiration date (24 hours)

### Email Template

The system uses a professional HTML email template (`password-reset-email.html`) with:
- School branding and colors
- Clear instructions
- Security warnings
- Responsive design

### Security Features

1. **Token Expiration** - Tokens expire after 24 hours
2. **One-time Use** - Tokens are cleared after password reset
3. **Password Validation** - Minimum 6 characters required
4. **Email Verification** - Only registered emails can request reset

## Configuration

### Email Settings

Update `application.properties` with your SMTP settings:

```properties
spring.mail.host=your.smtp.host.com
spring.mail.port=587
spring.mail.username=your_email@example.com
spring.mail.password=your_email_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Frontend URL

Set the frontend URL for reset links:

```properties
app.frontend.url=http://localhost:3000
```

## Frontend Integration

### 1. Forgot Password Form

```javascript
const forgotPassword = async (email) => {
  try {
    const response = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      // Show success message
    }
  } catch (error) {
    // Handle error
  }
};
```

### 2. Reset Password Form

```javascript
const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token, 
        newPassword, 
        confirmPassword 
      })
    });
    
    if (response.ok) {
      // Redirect to login
    }
  } catch (error) {
    // Handle error
  }
};
```

### 3. Token Verification

```javascript
const verifyToken = async (token) => {
  try {
    const response = await fetch(`/api/v1/auth/verify-token/${token}`);
    
    if (response.ok) {
      // Show reset password form
    } else {
      // Show invalid token message
    }
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid data, passwords don't match)
- `404` - User not found
- `500` - Internal Server Error

## Testing

### Test Cases

1. **Valid Email Request**
   - Send forgot password request with valid email
   - Verify email is sent
   - Check token is generated and stored

2. **Invalid Email Request**
   - Send request with non-existent email
   - Verify appropriate error response

3. **Token Verification**
   - Test valid token verification
   - Test expired token verification
   - Test invalid token verification

4. **Password Reset**
   - Test successful password reset
   - Test password mismatch validation
   - Test weak password validation
   - Test expired token reset attempt

## Dependencies

- Spring Boot Mail Starter
- Spring Boot Thymeleaf Starter
- Spring Security
- PostgreSQL

## Files Modified/Created

### New Files:
- `ResetPasswordRequest.java` - DTO for reset password requests
- `EmailService.java` - Email service interface
- `EmailServiceImpl.java` - Email service implementation
- `password-reset-email.html` - HTML email template
- `FORGOT_PASSWORD_API.md` - This documentation

### Modified Files:
- `AuthController.java` - Added reset password endpoints
- `AuthService.java` - Added reset password methods
- `AuthServiceImpl.java` - Implemented reset password logic
- `UserRepository.java` - Added findByResetToken method
- `application.properties` - Added email and frontend configuration
- `pom.xml` - Added Thymeleaf dependency

## Security Considerations

1. **Rate Limiting** - Consider implementing rate limiting for forgot password requests
2. **Email Security** - Use secure SMTP connections
3. **Token Security** - Tokens are cryptographically secure UUIDs
4. **Password Hashing** - New passwords are properly hashed using BCrypt
5. **Input Validation** - All inputs are validated and sanitized

## Future Enhancements

1. **Rate Limiting** - Prevent abuse of forgot password endpoint
2. **Audit Logging** - Log password reset attempts
3. **Multiple Email Templates** - Support for different languages
4. **SMS Verification** - Add SMS as alternative to email
5. **Security Questions** - Additional verification step

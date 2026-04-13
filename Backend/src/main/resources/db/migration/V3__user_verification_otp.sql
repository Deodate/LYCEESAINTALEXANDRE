-- 6-digit email verification OTP (see com.lycee.entity.User).
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp_expiry TIMESTAMP;

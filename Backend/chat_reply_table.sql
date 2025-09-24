-- Create chat_reply table for storing conversation replies
CREATE TABLE IF NOT EXISTS chat_reply (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    reply_message VARCHAR(2000) NOT NULL,
    replied_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Add foreign key constraint to link with chat_inquiry table
    FOREIGN KEY (conversation_id) REFERENCES chat_inquiry(id) ON DELETE CASCADE,
    
    -- Add index for better query performance
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_created_at (created_at)
);

-- Add some sample data for testing (optional)
-- INSERT INTO chat_reply (conversation_id, reply_message, replied_by, created_at) VALUES
-- (1, 'Thank you for your inquiry. We will get back to you soon.', 'Admin', NOW()),
-- (1, 'Your question has been forwarded to our support team.', 'Admin', NOW());








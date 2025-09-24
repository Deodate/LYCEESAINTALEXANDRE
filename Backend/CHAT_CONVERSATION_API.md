# Chat Conversation API Documentation

## Overview

The Chat Conversation API is designed to record user information when the chatbot asks for names and phone numbers. This helps in tracking conversations and following up with users who need assistance.

## Base URL

```
http://localhost:9090/api/v1/chat-conversation
```

## Endpoints

### 1. Record User Information

**POST** `/record-user-info`

Records user information when the bot asks "Please give us your names."

#### Request Body

```json
{
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "sessionId": "optional-session-id",
  "userType": "student"
}
```

#### Required Fields
- `name`: User's full name
- `phoneNumber`: User's phone number (minimum 10 digits)

#### Optional Fields
- `sessionId`: Session identifier for tracking conversations
- `userType`: Type of user (student, parent, teacher, etc.)

#### Response

**Success (201 Created)**
```json
{
  "status": 201,
  "message": "User information recorded successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "question": "Bot asked for user information - Name provided: John Doe",
    "answer": "User provided contact information for follow-up",
    "createdAt": "2025-01-20T10:30:00"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "status": 400,
  "message": "Name is required"
}
```

### 2. Search Conversations

**GET** `/search`

Search for conversations by name or phone number.

#### Query Parameters
- `name` (optional): Search by name (partial match)
- `phoneNumber` (optional): Search by phone number (partial match)

#### Examples

```
GET /api/v1/chat-conversation/search?name=John
GET /api/v1/chat-conversation/search?phoneNumber=123
GET /api/v1/chat-conversation/search?name=John&phoneNumber=123
```

#### Response

**Success (200 OK)**
```json
{
  "status": 200,
  "message": "Search completed",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "phoneNumber": "+1234567890",
      "question": "Bot asked for user information - Name provided: John Doe",
      "answer": "User provided contact information for follow-up",
      "createdAt": "2025-01-20T10:30:00"
    }
  ]
}
```

### 3. Get All Conversations

**GET** `/all`

Retrieve all recorded conversations.

#### Response

**Success (200 OK)**
```json
{
  "status": 200,
  "message": "All conversations retrieved",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "phoneNumber": "+1234567890",
      "question": "Bot asked for user information - Name provided: John Doe",
      "answer": "User provided contact information for follow-up",
      "createdAt": "2025-01-20T10:30:00"
    }
  ]
}
```

## Database Schema

The API uses the existing `chat_inquiry` table:

```sql
CREATE TABLE chat_inquiry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    question VARCHAR(1000) NOT NULL,
    answer VARCHAR(2000),
    created_at TIMESTAMP NOT NULL
);
```

## Integration with Frontend

### When Bot Asks for Names

1. **Bot Response**: "Please give us your names."
2. **User Input**: "My name is John Doe"
3. **Frontend Action**: 
   - Extract name from user message
   - Call `/api/v1/chat-conversation/record-user-info`
   - Record user information in database

### When User Submits Response Form

1. **User Clicks**: "Response" button
2. **Form Display**: Name and phone number fields
3. **User Submits**: Form with contact information
4. **Frontend Action**:
   - Call `/api/v1/chat-conversation/record-user-info`
   - Record complete user information

## Error Handling

### Validation Errors
- **Name Required**: 400 Bad Request
- **Phone Number Required**: 400 Bad Request
- **Invalid Phone Number**: 400 Bad Request (minimum 10 digits)

### Server Errors
- **Database Connection**: 500 Internal Server Error
- **Unexpected Errors**: 500 Internal Server Error

## Testing

### Using cURL

```bash
# Record user information
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "userType": "student"
  }'

# Search conversations
curl "http://localhost:9090/api/v1/chat-conversation/search?name=John"

# Get all conversations
curl "http://localhost:9090/api/v1/chat-conversation/all"
```

### Using Postman

1. **Create Collection**: "Chat Conversation API"
2. **Add Environment Variables**:
   - `base_url`: `http://localhost:9090`
3. **Create Requests**:
   - POST: `{{base_url}}/api/v1/chat-conversation/record-user-info`
   - GET: `{{base_url}}/api/v1/chat-conversation/search`
   - GET: `{{base_url}}/api/v1/chat-conversation/all`

## Security Considerations

- **CORS**: Configured to allow all origins (`@CrossOrigin(origins = "*")`)
- **Input Validation**: Server-side validation for all inputs
- **Phone Number Format**: Validates minimum 10 digits
- **SQL Injection**: Protected by JPA/Hibernate

### 4. Send Reply to Conversation

**POST** `/reply`

Send a reply to a specific conversation.

#### Request Body

```json
{
  "conversationId": 1,
  "replyMessage": "Thank you for your inquiry. We will get back to you soon.",
  "repliedBy": "Admin"
}
```

#### Required Fields
- `conversationId`: ID of the conversation to reply to
- `replyMessage`: The reply message content

#### Optional Fields
- `repliedBy`: Name of the person sending the reply (defaults to "Admin")

#### Response

**Success (201 Created)**
```json
{
  "status": 201,
  "message": "Reply sent successfully",
  "data": {
    "id": 1,
    "conversationId": 1,
    "replyMessage": "Thank you for your inquiry. We will get back to you soon.",
    "repliedBy": "Admin",
    "createdAt": "2025-01-20T10:30:00"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "status": 400,
  "message": "Conversation ID is required"
}
```

### 5. Get Conversation Replies

**GET** `/{conversationId}/replies`

Get all replies for a specific conversation.

#### Path Parameters
- `conversationId`: ID of the conversation

#### Response

**Success (200 OK)**
```json
{
  "status": 200,
  "message": "Replies retrieved successfully",
  "data": [
    {
      "id": 1,
      "conversationId": 1,
      "replyMessage": "Thank you for your inquiry. We will get back to you soon.",
      "repliedBy": "Admin",
      "createdAt": "2025-01-20T10:30:00"
    },
    {
      "id": 2,
      "conversationId": 1,
      "replyMessage": "Your question has been forwarded to our support team.",
      "repliedBy": "Admin",
      "createdAt": "2025-01-20T11:00:00"
    }
  ]
}
```

## Database Schema

The API uses two tables:

### chat_inquiry table
```sql
CREATE TABLE chat_inquiry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    question VARCHAR(1000) NOT NULL,
    answer VARCHAR(2000),
    created_at TIMESTAMP NOT NULL
);
```

### chat_reply table
```sql
CREATE TABLE chat_reply (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    reply_message VARCHAR(2000) NOT NULL,
    replied_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_inquiry(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_created_at (created_at)
);
```

## Future Enhancements

1. **Authentication**: Add JWT authentication for admin access
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Data Encryption**: Encrypt sensitive user data
4. **Analytics**: Add conversation analytics and reporting
5. **Email Notifications**: Send email notifications for new inquiries
6. **Real-time Updates**: WebSocket support for real-time reply notifications




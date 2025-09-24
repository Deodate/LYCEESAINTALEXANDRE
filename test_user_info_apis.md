# User Information Recording APIs Test Guide

## 🎯 **Available APIs for Recording User Information**

### **✅ Backend APIs (Spring Boot - Port 9090)**

#### **1. ChatConversationController**
- **Base URL**: `http://localhost:9090/api/v1/chat-conversation`
- **Purpose**: Record user information during chatbot fallback flow

#### **2. ChatInquiryController**
- **Base URL**: `http://localhost:9090/api/v1/chat-inquiries`
- **Purpose**: Record chat inquiries with questions and answers

### **✅ AIchatbot API (FastAPI - Port 8000)**
- **Base URL**: `http://localhost:8000`
- **Purpose**: Chatbot responses + recordUserInfo endpoint

---

## **🧪 Testing the APIs**

### **Prerequisites:**
1. **Backend (Spring Boot)**: Running on port 9090
2. **AIchatbot (FastAPI)**: Running on port 8000
3. **Frontend (React)**: Running on port 3000

---

## **Test 1: Backend ChatConversation API**

### **✅ POST /api/v1/chat-conversation/record-user-info**

#### **Request:**
```bash
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "0781234567",
    "sessionId": "session123",
    "userType": "student"
  }'
```

#### **Expected Response (201 Created):**
```json
{
  "status": 201,
  "message": "User information recorded successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "phoneNumber": "0781234567",
    "question": "Bot asked for user information - Name provided: John Doe",
    "answer": "User provided contact information for follow-up",
    "createdAt": "2025-01-20T10:30:00"
  }
}
```

#### **Validation Tests:**
```bash
# Test missing name
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "0781234567"}'

# Test missing phone
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'

# Test invalid phone (less than 10 digits)
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phoneNumber": "123"}'
```

---

## **Test 2: Backend ChatInquiry API**

### **✅ POST /api/v1/chat-inquiries**

#### **Request:**
```bash
curl -X POST "http://localhost:9090/api/v1/chat-inquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phoneNumber": "0789876543",
    "question": "What are the admission requirements?",
    "answer": "Admission requirements include completed application form, transcripts, recommendation letters, and standardized test scores."
  }'
```

#### **Expected Response (201 Created):**
```json
{
  "status": 201,
  "message": "Inquiry recorded",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "phoneNumber": "0789876543",
    "question": "What are the admission requirements?",
    "answer": "Admission requirements include completed application form, transcripts, recommendation letters, and standardized test scores.",
    "createdAt": "2025-01-20T10:35:00"
  }
}
```

### **✅ GET /api/v1/chat-inquiries/search**

#### **Search by Name:**
```bash
curl "http://localhost:9090/api/v1/chat-inquiries/search?name=John"
```

#### **Search by Phone:**
```bash
curl "http://localhost:9090/api/v1/chat-inquiries/search?phoneNumber=078"
```

#### **Search by Both:**
```bash
curl "http://localhost:9090/api/v1/chat-inquiries/search?name=John&phoneNumber=078"
```

---

## **Test 3: AIchatbot recordUserInfo API**

### **✅ POST /record-user-info**

#### **Request:**
```bash
curl -X POST "http://localhost:8000/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "phoneNumber": "0785555555",
    "sessionId": "session456",
    "userType": "parent"
  }'
```

#### **Expected Response (201 Created):**
```json
{
  "status": 201,
  "message": "User information recorded successfully",
  "data": {
    "id": 3,
    "name": "Alice Johnson",
    "phoneNumber": "0785555555",
    "question": "Bot asked for user information - Name provided: Alice Johnson",
    "answer": "User provided contact information for follow-up",
    "createdAt": "2025-01-20T10:40:00"
  }
}
```

---

## **Test 4: Frontend Integration**

### **✅ Complete Fallback Flow Test**

#### **Steps:**
1. **Open browser**: `http://localhost:3000`
2. **Click chat icon** (bottom right)
3. **Select role**: "Current Student"
4. **Send out-of-domain question**: "What is the weather like today?"
5. **Follow the flow**:
   - ✅ Bot: "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
   - ✅ After 2s: "Please can you share your name?"
   - ✅ User: "John Smith"
   - ✅ Bot: "Can you share your phone number?"
   - ✅ User: "0781234567"
   - ✅ Bot: "Please describe your question then check response after between 5 - 8 hours."
   - ✅ User: "I need information about admission requirements"
   - ✅ Bot: "Thank you for your question, will get back to you soon. Check response by click on "Response" option" ✅ **IN RED!**

#### **Expected Backend Record:**
After the final step, check the database for a new record:
```bash
curl "http://localhost:9090/api/v1/chat-conversation/search?name=John"
```

---

## **Test 5: Database Verification**

### **✅ Check Database Records**

#### **Get All Conversations:**
```bash
curl "http://localhost:9090/api/v1/chat-conversation/all"
```

#### **Get All Inquiries:**
```bash
curl "http://localhost:9090/api/v1/chat-inquiries"
```

#### **Expected Database Schema:**
```sql
-- chat_inquiry table
CREATE TABLE chat_inquiry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    question VARCHAR(1000) NOT NULL,
    answer VARCHAR(2000),
    created_at TIMESTAMP NOT NULL
);
```

---

## **Test 6: Error Handling**

### **✅ Test Invalid Requests**

#### **Missing Required Fields:**
```bash
# Missing name
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "0781234567"}'

# Missing phone
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

#### **Invalid Phone Numbers:**
```bash
# Less than 10 digits
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phoneNumber": "123"}'

# No digits
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phoneNumber": "abc"}'
```

#### **Expected Error Responses:**
```json
{
  "status": 400,
  "message": "Name is required"
}

{
  "status": 400,
  "message": "Phone number is required"
}

{
  "status": 400,
  "message": "Phone number must contain at least 10 digits"
}
```

---

## **🔧 API Endpoints Summary**

### **Backend APIs (Port 9090):**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/chat-conversation/record-user-info` | Record user info during fallback flow |
| GET | `/api/v1/chat-conversation/search` | Search conversations by name/phone |
| GET | `/api/v1/chat-conversation/all` | Get all conversations |
| POST | `/api/v1/chat-inquiries` | Record chat inquiry with question |
| GET | `/api/v1/chat-inquiries/search` | Search inquiries by name/phone |

### **AIchatbot APIs (Port 8000):**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/chat` | Get chatbot response |
| POST | `/record-user-info` | Record user info (proxies to Backend) |

### **Frontend Integration:**
- ✅ **Automatic recording** during fallback flow
- ✅ **Manual recording** via Response form
- ✅ **Error handling** for failed API calls
- ✅ **Validation** before API calls

---

## **🎯 Success Criteria:**

### **✅ All Tests Pass When:**

1. **Backend APIs**: All endpoints respond correctly
2. **AIchatbot API**: recordUserInfo endpoint works
3. **Frontend Integration**: Automatically records user info
4. **Database**: Records are properly stored
5. **Validation**: Phone number validation works
6. **Error Handling**: Proper error responses
7. **Search**: Can find records by name/phone

### **✅ Integration Features:**
- ✅ **Automatic recording** during chatbot fallback flow
- ✅ **Phone validation** (minimum 10 digits)
- ✅ **Error handling** for network issues
- ✅ **Search functionality** for admin use
- ✅ **Session tracking** for conversation management

---

## **🚀 Ready for Production:**

The user information recording system now includes:
- **Complete API coverage** for recording user data
- **Frontend integration** with automatic recording
- **Backend validation** and error handling
- **Search capabilities** for admin management
- **Database persistence** for all records

**All APIs are ready for recording user name and phone number!** 🎉











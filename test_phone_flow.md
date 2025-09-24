# Phone Number Flow Test Guide

## 🧪 Testing the New Phone Number Collection Flow

### **Prerequisites:**
1. Backend server running on `http://localhost:9090`
2. Frontend React app running on `http://localhost:3000`
3. FastAPI chatbot running on `http://localhost:8000`

### **Test Scenario 1: Complete Name → Phone Flow**

#### **Step-by-Step Test:**

1. **Open the chat interface**
   - Navigate to `http://localhost:3000`
   - Click the chat icon (bottom right)

2. **Select your role**
   - Choose any role (e.g., "Current Student")

3. **Trigger the fallback flow**
   - Type: "Hello" and press Enter
   - **Expected**: Bot responds with fallback message
   - **Wait 2 seconds**: Bot asks "Please give us your names."

4. **Provide your name**
   - Type: "My name is John Doe" and press Enter
   - **Expected**: Bot stores your name and asks for phone number
   - **Wait 1 second**: Bot asks "Which your phone number?"

5. **Provide your phone number**
   - Type: "My phone is +1234567890" and press Enter
   - **Expected**: Bot records complete information and says "Thank you! How can I help you today?"

6. **Verify database recording**
   ```bash
   curl "http://localhost:9090/api/v1/chat-conversation/search?name=John"
   ```

### **Test Scenario 2: Different Name Formats**

#### **Test these name formats:**
- "My name is John Doe" ✅
- "I'm John Doe" ✅
- "I am John Doe" ✅
- "John Doe" ✅
- "John" ✅

#### **Test these phone formats:**
- "+1234567890" ✅
- "1234567890" ✅
- "My phone is +1234567890" ✅
- "Phone: 123-456-7890" ✅

### **Test Scenario 3: Response Form (Alternative)**

1. **Click "Response" button**
2. **Fill the form**:
   - Name: "Jane Smith"
   - Phone: "+9876543210"
3. **Click Submit**
4. **Verify**: Complete information recorded

### **Expected Database Records:**

After successful tests, you should see records in the `chat_inquiry` table:

```sql
SELECT * FROM chat_inquiry ORDER BY created_at DESC LIMIT 5;
```

**Expected fields:**
- `name`: User's full name
- `phone_number`: User's phone number
- `question`: "Bot asked for user information - Name provided: [Name]"
- `answer`: "User provided contact information for follow-up"
- `created_at`: Timestamp

### **API Testing:**

#### **Test the recording API directly:**
```bash
curl -X POST "http://localhost:9090/api/v1/chat-conversation/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phoneNumber": "+1234567890",
    "userType": "student"
  }'
```

#### **Search for recorded conversations:**
```bash
# Search by name
curl "http://localhost:9090/api/v1/chat-conversation/search?name=John"

# Search by phone
curl "http://localhost:9090/api/v1/chat-conversation/search?phoneNumber=123"

# Get all conversations
curl "http://localhost:9090/api/v1/chat-conversation/all"
```

### **Troubleshooting:**

#### **If the flow doesn't work:**

1. **Check browser console** (F12) for JavaScript errors
2. **Verify all servers are running**:
   ```bash
   # Backend
   curl "http://localhost:9090/health"
   
   # FastAPI chatbot
   curl "http://localhost:8000/health"
   ```

3. **Check database connection**:
   ```bash
   curl "http://localhost:9090/api/v1/chat-conversation/all"
   ```

4. **Reset chat state**:
   - Close and reopen the chat window
   - This resets all state variables

#### **Common Issues:**

- **Phone number not detected**: Make sure the message contains digits
- **Name not detected**: Make sure the message contains "name" or is long enough
- **API errors**: Check if backend is running and database is accessible
- **State issues**: Close and reopen chat to reset state

### **Success Criteria:**

✅ **Complete flow works**: Name → Phone → Thank you  
✅ **Database recording**: Information saved with correct format  
✅ **State management**: Proper reset when chat is reopened  
✅ **Error handling**: Graceful handling of invalid inputs  
✅ **API integration**: Backend calls work correctly  
✅ **Form alternative**: Response button form works as backup











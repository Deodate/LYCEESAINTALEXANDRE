# Fallback Flow Test Guide

## 🎯 **New Fallback Flow Implementation**

### **Problem Solved:**
When users ask questions not in our dataset, they now go through a structured flow to collect their information and redirect them to the Response option.

---

## **🔄 New Fallback Flow:**

### **Step 1: Out-of-Domain Question**
- **User asks**: Any question not in our dataset (e.g., "What is the weather like today?")
- **Bot responds**: "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
- **After 2 seconds**: "Please can you share your name?"

### **Step 2: Name Collection**
- **User provides**: Their name (e.g., "My name is John Smith" or just "John")
- **Bot responds**: "Can you share your phone number?"

### **Step 3: Phone Number Collection**
- **User provides**: Their phone number (e.g., "0781234567" or "My phone is 0781234567")
- **Bot responds**: "Please describe your question then check response after between 5 - 8 hours."

### **Step 4: Question Description**
- **User provides**: Detailed description of their question (must be >10 characters)
- **Bot responds**: "Thank you for your question, click on Response option after some time"
- **After 3 seconds**: Automatically resets to show the option list again

---

## **🧪 Test Scenarios**

### **Prerequisites:**
1. FastAPI chatbot running: `cd AIchatbot && source .venv/bin/activate && uvicorn app:app --host 0.0.0.0 --port 8000 --reload`
2. Frontend React app running: `cd lycee && npm start`

---

## **Test 1: Complete Fallback Flow**

### **✅ Expected: Full flow from start to finish**

#### **Steps:**
1. **Open browser**: `http://localhost:3000`
2. **Click chat icon** (bottom right)
3. **Select role**: Choose "Current Student"
4. **Send out-of-domain question**: "What is the weather like today?"
5. **Observe flow**:
   - ✅ Bot: "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
   - ✅ After 2s: "Please can you share your name?"
   - ✅ User: "My name is John Smith"
   - ✅ Bot: "Can you share your phone number?"
   - ✅ User: "0781234567"
   - ✅ Bot: "Please describe your question then check response after between 5 - 8 hours."
   - ✅ User: "I want to know about the school's admission process for international students"
   - ✅ Bot: "Thank you for your question, click on Response option after some time"
   - ✅ After 3s: Automatically shows option list again

---

## **Test 2: API Testing with Curl**

### **✅ Expected: Backend returns fallback message**

#### **Test Commands:**
```bash
# Test out-of-domain question
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"role": "Current Student", "message": "What is the weather like today?"}'

# Expected: {"intent":"out_of_scope","reply":"No. Agent to assit you! Please back on this chat between 2 - 3 hours"}

# Test complex question
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"role": "Current Student", "message": "Can you explain the entire school curriculum in detail with step-by-step instructions for each program including all requirements and prerequisites?"}'

# Expected: {"intent":"complex_escalation","reply":"No. Agent to assit you! Please back on this chat between 2 - 3 hours"}
```

---

## **Test 3: Name Extraction**

### **✅ Expected: Proper name extraction from various formats**

#### **Test Cases:**
```javascript
// Test different name formats:
"My name is John Smith"     // Should extract: "John Smith"
"I'm John"                  // Should extract: "John"
"I am Mary Johnson"         // Should extract: "Mary Johnson"
"John Smith"                // Should extract: "John Smith"
"name is David"             // Should extract: "David"
```

---

## **Test 4: Phone Number Extraction**

### **✅ Expected: Proper phone number extraction**

#### **Test Cases:**
```javascript
// Test different phone formats:
"0781234567"                // Should extract: "0781234567"
"My phone is 0781234567"    // Should extract: "0781234567"
"078 123 4567"              // Should extract: "0781234567"
"+250781234567"             // Should extract: "+250781234567"
"Phone: 078-123-4567"       // Should extract: "078-123-4567"
```

---

## **Test 5: Question Description Validation**

### **✅ Expected: Only accepts descriptions >10 characters**

#### **Test Cases:**
```javascript
// Should trigger question collection:
"Hello"                     // Too short, should not trigger
"Hi there"                  // Too short, should not trigger

// Should trigger final response:
"I want to know about the school's admission process for international students and what documents are required"
"This is a detailed question about the curriculum and programs offered by the school"
```

---

## **Test 6: Automatic Reset**

### **✅ Expected: Returns to option list after completion**

#### **Steps:**
1. Complete the full fallback flow
2. After final message: "Thank you for your question, click on Response option after some time"
3. **Wait 3 seconds**
4. **Observe**: Chat automatically resets to show the option list
5. **Verify**: All state variables are reset

---

## **Test 7: State Management**

### **✅ Expected: Proper state reset and management**

#### **Check State Variables:**
```javascript
// After completion and reset:
hasAskedForName: false
hasAskedForPhone: false
hasAskedForQuestion: false
userName: ""
userPhone: ""
optionsSelected: false
selectedOption: null
messages: []
```

---

## **Test 8: Backend Data Recording**

### **✅ Expected: User data recorded in backend**

#### **Check Backend Logs:**
```bash
# Look for successful API calls to:
POST /api/v1/chat-conversation/record-user-info

# With payload:
{
  "name": "John Smith",
  "phoneNumber": "0781234567",
  "question": "I want to know about the school's admission process...",
  "sessionId": "1234567890",
  "userType": "Current Student"
}
```

---

## **🔧 Technical Implementation Details:**

### **Frontend Changes (ChatbotInterface.jsx):**
- ✅ Added `hasAskedForQuestion` state
- ✅ Added `userPhone` state
- ✅ Updated fallback message: "Please can you share your name?"
- ✅ Updated phone message: "Can you share your phone number?"
- ✅ Added question collection: "Please describe your question then check response after between 5 - 8 hours."
- ✅ Added final message: "Thank you for your question, click on Response option after some time"
- ✅ Added automatic reset after 3 seconds
- ✅ Updated `recordUserInfo` to include question parameter

### **Backend Changes (app.py):**
- ✅ Fallback message already implemented: "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
- ✅ Intent detection for out-of-domain and complex questions
- ✅ Proper role detection and response generation

---

## **🎯 Success Criteria:**

### **✅ All Tests Pass When:**

1. **Fallback Detection**: Out-of-domain questions trigger fallback flow
2. **Name Collection**: Proper name extraction and storage
3. **Phone Collection**: Proper phone number extraction and storage
4. **Question Collection**: Only accepts descriptions >10 characters
5. **Final Message**: Shows "Thank you for your question, click on Response option after some time"
6. **Automatic Reset**: Returns to option list after 3 seconds
7. **Data Recording**: User information recorded in backend
8. **State Management**: All state variables properly reset

### **✅ User Experience:**
- Smooth flow from question to data collection
- Clear instructions at each step
- Automatic progression through the flow
- Seamless return to main options
- Professional messaging throughout

---

## **🚀 Ready for Production:**

The fallback flow now provides:
- **Structured data collection** for out-of-domain questions
- **Professional user experience** with clear messaging
- **Automatic flow progression** with proper timing
- **Complete data recording** in the backend
- **Seamless return** to main chat options

**Users with complex questions are now properly guided to the Response option!** 🎉











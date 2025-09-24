# Chatbot Flow Test Documentation

## ✅ Implementation Complete

The chatbot now has a smart fallback mechanism that handles cases when the AI doesn't have a specific response, plus a new contact form for the "Response" option, and a sequential name/phone number collection flow.

## 🔄 New Flow:

### **Scenario 1: AI Has No Response (Updated)**
1. User asks: "Hello" or any out-of-scope question
2. Bot responds: "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
3. **After 2 seconds**, bot asks: "Please give us your names."
4. User provides their name: "My name is John Doe"
5. **After 1 second**, bot asks: "Which your phone number?"
6. User provides phone number: "My phone is +1234567890"
7. Bot acknowledges: "Thank you! How can I help you today?"
8. **Complete user information is recorded in database**

### **Scenario 2: AI Has Response**
1. User asks: "When does the semester start?"
2. Bot responds: "The next semester starts on September 2nd. Orientation will be on September 1st."
3. No additional questions asked

### **Scenario 3: Response Button**
1. User clicks "Response" button
2. Bot responds: "Please provide your contact information below:"
3. **Contact form appears** with:
   - Full Name field (required)
   - Phone Number field (required)
   - Submit button (purple, disabled until both fields filled)
   - Cancel button (gray)
4. User fills form and clicks Submit
5. Bot acknowledges: "Thank you for providing your information! We'll get back to you soon."
6. **Complete user information is recorded in database**

### **Scenario 4: Multiple Fallbacks**
- The name request only happens **once per chat session**
- If the user closes and reopens the chat, the state resets

## 🧪 Test Cases:

### **Test 1: Complete name/phone flow**
**Steps:**
1. Open chat interface
2. Ask: "Hello" (triggers fallback)
3. Wait for: "Please give us your names."
4. Respond: "My name is John Doe"
5. Wait for: "Which your phone number?"
6. Respond: "My phone is +1234567890"
7. Verify: "Thank you! How can I help you today?"
8. Check database for recorded information

### **Test 2: School-related question**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"role": "student", "message": "When does the semester start?", "history": []}'
```
**Expected Flow:**
1. Response: "The next semester starts on September 2nd. Orientation will be on September 1st."
2. No additional questions

### **Test 3: Response Button**
**Steps:**
1. Open chat interface
2. Click "Response" button
3. Fill in name and phone number
4. Click Submit
5. Verify acknowledgment message
6. Check database for recorded information

## 🎯 Key Features:

- ✅ **2-second delay** before asking for name
- ✅ **1-second delay** before asking for phone number
- ✅ **Sequential flow**: Name → Phone Number → Thank you
- ✅ **One-time only** name/phone request per session
- ✅ **State reset** when chat is reopened
- ✅ **Smart detection** of fallback responses
- ✅ **Name extraction** from user messages
- ✅ **Phone number extraction** from user messages
- ✅ **Complete database recording** with both name and phone
- ✅ **Contact form** for Response option
- ✅ **Form validation** (both fields required)
- ✅ **Cancel functionality** to go back to role selection

## 🚀 Ready to Test:

1. Start your React app: `cd lycee && npm start`
2. Open `http://localhost:3000`
3. Click the chat icon
4. **Test complete flow**: Ask "Hello" → Provide name → Provide phone
5. **Test Response form**: Click "Response" button
6. **Test normal flow**: Try asking "When does the semester start?"

## 📋 Form Features:

- **Required fields**: Both name and phone number must be filled
- **Submit button**: Purple, disabled until both fields are complete
- **Cancel button**: Gray, returns to role selection
- **Form styling**: Clean, professional appearance
- **Validation**: Real-time validation feedback

## 🔄 Conversation Flow:

### **Name Collection:**
- **Trigger**: Out-of-scope questions
- **Bot asks**: "Please give us your names."
- **User responds**: "My name is [Name]" or "[Name]"
- **Name extraction**: Intelligent parsing of user input

### **Phone Collection:**
- **Trigger**: After name is provided
- **Bot asks**: "Which your phone number?"
- **User responds**: "[Phone number]" or "My phone is [Phone number]"
- **Phone extraction**: Intelligent parsing of phone formats

### **Database Recording:**
- **Complete information**: Name + Phone Number
- **Session tracking**: User type and session ID
- **Timestamp**: When information was provided
- **Search capability**: Find users by name or phone

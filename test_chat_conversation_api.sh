#!/bin/bash

# Test script for Chat Conversation API
# Make sure the backend is running on http://localhost:9090

BASE_URL="http://localhost:9090/api/v1/chat-conversation"

echo "🧪 Testing Chat Conversation API"
echo "=================================="

# Test 1: Record user information
echo "📝 Test 1: Recording user information..."
curl -X POST "$BASE_URL/record-user-info" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "userType": "student"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo -e "\n"

# Test 2: Search conversations
echo "🔍 Test 2: Searching conversations by name..."
curl -X GET "$BASE_URL/search?name=John" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo -e "\n"

# Test 3: Get all conversations
echo "📋 Test 3: Getting all conversations..."
curl -X GET "$BASE_URL/all" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo -e "\n"
echo "✅ API testing completed!"











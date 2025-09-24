import React, { useState, useRef, useEffect } from "react";
import { FaRegUser, FaRegSmile } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { CHATBOT_BASE_URL, BACKEND_BASE_URL } from "../../../config";
import "./ChatbotInterface.css";

// Previous Chat Item Component
const PreviousChatItem = ({ chat }) => {
    const [adminReplies, setAdminReplies] = useState([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);

    // Fetch admin replies for this conversation
    const fetchAdminReplies = async () => {
        if (!chat.id) return;
        
        setIsLoadingReplies(true);
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/v1/chat-conversation/${chat.id}/replies`);
            if (response.ok) {
                const data = await response.json();
                setAdminReplies(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching admin replies:", error);
        } finally {
            setIsLoadingReplies(false);
        }
    };

    // Fetch replies when component mounts
    useEffect(() => {
        fetchAdminReplies();
    }, [chat.id]);

    return (
        <div style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px"
        }}>
            {/* Date Header */}
            <div style={{
                textAlign: "center",
                marginBottom: "10px",
                padding: "5px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "4px"
            }}>
                <span style={{
                    fontSize: "10px",
                    color: "#ffffff",
                    fontWeight: "bold"
                }}>
                    {new Date(chat.createdAt).toLocaleDateString()} - {new Date(chat.createdAt).toLocaleTimeString()}
                </span>
            </div>
            
            {/* User Message */}
            <div style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "10px"
            }}>
                <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "#32CD32",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "8px",
                    flexShrink: 0
                }}>
                    <span style={{
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "bold"
                    }}>
                        {chat.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div style={{
                    backgroundColor: "#32CD32",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    wordBreak: "break-word"
                }}>
                    <p style={{
                        margin: "0",
                        fontSize: "12px",
                        fontWeight: "bold"
                    }}>
                        {chat.name}
                    </p>
                    <p style={{
                        margin: "5px 0 0 0",
                        fontSize: "11px"
                    }}>
                        {chat.question.includes("Bot asked for user information") 
                            ? "User provided contact information" 
                            : chat.question}
                    </p>
                </div>
            </div>
            
            {/* Bot Message */}
            <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end"
            }}>
                <div style={{
                    backgroundColor: "white",
                    color: "#333",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    marginRight: "8px"
                }}>
                    <p style={{
                        margin: "0",
                        fontSize: "11px"
                    }}>
                        {chat.answer.includes("User provided contact information") 
                            ? "Thank you for providing your information. We'll get back to you soon." 
                            : (chat.answer || "Thank you for your question. We'll get back to you soon.")}
                    </p>
                </div>
                <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "#4682B4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                }}>
                    <span style={{
                        fontSize: "16px"
                    }}>
                        🤖
                    </span>
                </div>
            </div>

            {/* Admin Replies Section */}
            {isLoadingReplies ? (
                <div style={{
                    textAlign: "center",
                    padding: "10px",
                    marginTop: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px"
                }}>
                    <p style={{ fontSize: "10px", color: "#ffffff" }}>Loading admin replies...</p>
                </div>
            ) : adminReplies.length > 0 ? (
                <div style={{ marginTop: "10px" }}>
                    {adminReplies.map((reply, replyIndex) => (
                        <div key={reply.id || replyIndex} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                            marginBottom: "8px"
                        }}>
                            <div style={{
                                backgroundColor: "#28a745", // Green color for admin replies
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "15px",
                                maxWidth: "70%",
                                wordBreak: "break-word",
                                marginRight: "8px",
                                border: "2px solid #20c997"
                            }}>
                                <p style={{
                                    margin: "0 0 4px 0",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    opacity: 0.9
                                }}>
                                    Admin Reply
                                </p>
                                <p style={{
                                    margin: "0",
                                    fontSize: "11px"
                                }}>
                                    {reply.replyMessage}
                                </p>
                                <p style={{
                                    margin: "4px 0 0 0",
                                    fontSize: "9px",
                                    opacity: 0.8
                                }}>
                                    {new Date(reply.createdAt).toLocaleDateString()} {new Date(reply.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <div style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: "#28a745",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                <span style={{
                                    fontSize: "14px"
                                }}>
                                    👨‍💼
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

// Admin Response Display Component
const AdminResponseDisplay = ({ userName, userPhone }) => {
    const [adminReplies, setAdminReplies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasReplies, setHasReplies] = useState(false);

    // Check for admin replies when component mounts
    useEffect(() => {
        const checkForAdminReplies = async () => {
            if (!userName || !userPhone) {
                setIsLoading(false);
                return;
            }

            try {
                // First, get the user's conversations
                const searchUrl = `${BACKEND_BASE_URL}/api/v1/chat-conversation/search?name=${encodeURIComponent(userName)}&phoneNumber=${encodeURIComponent(userPhone)}`;
                const searchResponse = await fetch(searchUrl);
                
                if (searchResponse.ok) {
                    const searchData = await searchResponse.json();
                    const conversations = searchData.data || [];
                    
                    // Check each conversation for admin replies
                    for (const conversation of conversations) {
                        const replyResponse = await fetch(`${BACKEND_BASE_URL}/api/v1/chat-conversation/${conversation.id}/replies`);
                        if (replyResponse.ok) {
                            const replyData = await replyResponse.json();
                            if (replyData.data && replyData.data.length > 0) {
                                setAdminReplies(replyData.data);
                                setHasReplies(true);
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking for admin replies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkForAdminReplies();
    }, [userName, userPhone]);

    if (isLoading) {
        return (
            <div style={{ 
                textAlign: "center", 
                marginBottom: "15px",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
                <p style={{ 
                    fontSize: "14px", 
                    color: "#ffffff", 
                    margin: "0",
                    fontWeight: "500"
                }}>
                    Checking for responses...
                </p>
            </div>
        );
    }

    if (hasReplies) {
        return (
            <div style={{ 
                textAlign: "center", 
                marginBottom: "15px"
            }}>
                {adminReplies.map((reply, index) => (
                    <div key={index} style={{
                        padding: "15px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        marginBottom: "10px"
                    }}>
                        <p style={{ 
                            fontSize: "12px", 
                            color: "#28a745", 
                            margin: "0 0 8px 0",
                            fontWeight: "600"
                        }}>
                            👨‍💼 Admin Response
                        </p>
                        <p style={{ 
                            fontSize: "14px", 
                            color: "#ffffff", 
                            margin: "0 0 8px 0",
                            fontWeight: "500"
                        }}>
                            {reply.replyMessage}
                        </p>
                        <p style={{ 
                            fontSize: "11px", 
                            color: "#cccccc", 
                            margin: "0"
                        }}>
                            {new Date(reply.createdAt).toLocaleDateString()} {new Date(reply.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{ 
            textAlign: "center", 
            marginBottom: "15px",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
            <p style={{ 
                fontSize: "14px", 
                color: "#ffffff", 
                margin: "0",
                fontWeight: "500"
            }}>
                No response yet, check soon!
            </p>
        </div>
    );
};

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [optionsSelected, setOptionsSelected] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAskedForName, setHasAskedForName] = useState(false);
    const [hasAskedForPhone, setHasAskedForPhone] = useState(false);
    const [hasAskedForQuestion, setHasAskedForQuestion] = useState(false);
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: ""
    });
    const [showPreviousChats, setShowPreviousChats] = useState(false);
    const [previousChats, setPreviousChats] = useState([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    
    // Admin replies state
    const [adminReplies, setAdminReplies] = useState([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [showAdminReplies, setShowAdminReplies] = useState(false);

    // Map options to colors
    const optionColors = {
        "Future Student": "#FF6347", // Tomato
        "Current Student": "#4682B4", // SteelBlue
        "Parent": "#32CD32", // LimeGreen
        "Lycee Teacher": "#FFD700", // Gold
        "Response": "#8A2BE2", // BlueViolet
        "Option": "#00CED1", // DarkTurquoise (fallback/default for the extra option)
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        if (!isOpen) {
            // Reset states when opening chat
            setHasAskedForName(false);
            setHasAskedForPhone(false);
            setHasAskedForQuestion(false);
            setUserName("");
            setUserPhone("");
            setShowForm(false);
            setShowPreviousChats(false);
            setOptionsSelected(false);
            setSelectedOption(null);
            setMessages([]);
            setFormData({ name: "", phoneNumber: "" });
            setPreviousChats([]);
            setAdminReplies([]);
            setShowAdminReplies(false);
            
            // Check for existing conversation and admin replies
            setTimeout(() => {
                checkExistingConversation();
            }, 100);
        }
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleFormInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFormSubmit = async () => {
        if (formData.name.trim() && formData.phoneNumber.trim()) {
            console.log("=== FORM SUBMISSION DEBUG ===");
            console.log("Form data:", formData);
            
            // Record user information in the backend
            const conversationId = await recordUserInfo(formData.name, formData.phoneNumber, "Response form submission");
            
            // Store user info for later use
            localStorage.setItem('userName', formData.name);
            localStorage.setItem('userPhone', formData.phoneNumber);
            localStorage.setItem('conversationId', conversationId);
            
            console.log("Data stored in localStorage:");
            console.log("userName:", localStorage.getItem('userName'));
            console.log("userPhone", localStorage.getItem('userPhone'));
            console.log("conversationId:", localStorage.getItem('conversationId'));
            console.log("All localStorage keys:", Object.keys(localStorage));
            
            // Hide form and return to main chat interface
            setShowForm(false);
            setOptionsSelected(false);
            setSelectedOption(null);
            setMessages([]);
            
            // Fetch and display previous conversations with admin replies
            const previousChats = await fetchPreviousChats(formData.name, formData.phoneNumber);
            if (previousChats.length > 0) {
                setPreviousChats(previousChats);
                setShowPreviousChats(true);
                
                // Check if any conversation has admin replies
                let hasAdminReplies = false;
                let adminRepliesToShow = [];
                
                for (const chat of previousChats) {
                    try {
                        const replyResponse = await fetch(`${BACKEND_BASE_URL}/api/v1/chat-conversation/${chat.id}/replies`);
                        if (replyResponse.ok) {
                            const replyData = await replyResponse.json();
                            if (replyData.data && replyData.data.length > 0) {
                                hasAdminReplies = true;
                                adminRepliesToShow = replyData.data;
                                break;
                            }
                        }
                    } catch (error) {
                        console.error("Error checking admin replies:", error);
                    }
                }
                
                                // Don't add any messages here - let AdminResponseDisplay handle the display
            } else {
                // No previous conversations found - AdminResponseDisplay will handle the display
            }
            
            // Reset form data
            setFormData({ name: "", phoneNumber: "" });
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setOptionsSelected(false);
        setSelectedOption(null);
        setMessages([]); // Clear any messages to show clean option list
    };

    const handleBackToChat = () => {
        setShowPreviousChats(false);
        setShowForm(false);
        setOptionsSelected(false);
        setSelectedOption(null);
        setMessages([]); // Clear any messages to show clean option list
        setPreviousChats([]);
    };

    const clearUserData = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
    };

    // Function to record user information in the backend
    const recordUserInfo = async (name, phoneNumber = null, question = null) => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/v1/chat-conversation/record-user-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    phoneNumber: phoneNumber || "Not provided",
                    question: question || "Not provided",
                    sessionId: Date.now().toString(), // Simple session ID
                    userType: selectedOption
                })
            });

            if (!response.ok) {
                console.error('Failed to record user info:', response.status);
                return null;
            }

            const data = await response.json();
            console.log('User info recorded successfully:', data);
            return data.data?.id || null; // Return conversation ID
        } catch (error) {
            console.error('Error recording user info:', error);
            return null;
        }
    };

    // Function to fetch previous chat conversations
    const fetchPreviousChats = async (name, phoneNumber) => {
        try {
            setIsLoadingChats(true);
            console.log('=== FETCH PREVIOUS CHATS DEBUG ===');
            console.log('Fetching previous chats for:', name, phoneNumber);
            console.log('Backend URL:', BACKEND_BASE_URL);
            
            const url = `${BACKEND_BASE_URL}/api/v1/chat-conversation/search?name=${encodeURIComponent(name)}&phoneNumber=${encodeURIComponent(phoneNumber)}`;
            console.log('Full URL:', url);
            
            // Search by name and phone number
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                console.error('Failed to fetch previous chats:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                return [];
            }

            const data = await response.json();
            console.log('Previous chats fetched:', data);
            
            if (data.data && Array.isArray(data.data)) {
                console.log('Returning data array with length:', data.data.length);
                return data.data;
            }
            console.log('No data array found, returning empty array');
            return [];
        } catch (error) {
            console.error('Error fetching previous chats:', error);
            return [];
        } finally {
            setIsLoadingChats(false);
        }
    };

    // Check for admin replies for a conversation
    const checkForAdminReplies = async (conversationId) => {
        if (!conversationId) return;
        
        setIsLoadingReplies(true);
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/v1/chat-conversation/${conversationId}/replies`);
            if (response.ok) {
                const data = await response.json();
                const replies = data.data || [];
                setAdminReplies(replies);
                
                if (replies.length > 0) {
                    setShowAdminReplies(true);
                    // Add admin replies to messages
                    const replyMessages = replies.map(reply => ({
                        sender: "bot",
                        text: `Admin Reply: ${reply.replyMessage}`,
                        timestamp: reply.createdAt,
                        isAdminReply: true
                    }));
                    setMessages(replyMessages);
                }
            } else {
                console.error("Failed to fetch admin replies:", response.status);
            }
        } catch (error) {
            console.error("Error fetching admin replies:", error);
        } finally {
            setIsLoadingReplies(false);
        }
    };

    // Check for existing conversation when user opens chat
    const checkExistingConversation = async () => {
        const storedName = localStorage.getItem('userName');
        const storedPhone = localStorage.getItem('userPhone');
        const storedConversationId = localStorage.getItem('conversationId');
        
        if (storedName && storedPhone && storedConversationId) {
            // User has existing conversation, check for admin replies
            await checkForAdminReplies(storedConversationId);
        }
    };

    // Function to call the FastAPI chatbot
    const callChatbotAPI = async (message, role = null) => {
        try {
            setIsLoading(true);
            const startTime = Date.now();
            
            const response = await fetch(`${CHATBOT_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: role,
                    message: message,
                    history: messages.map(msg => ({
                        sender: msg.sender,
                        text: msg.text
                    }))
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Ensure loading animation lasts for at least 5 seconds
            const elapsedTime = Date.now() - startTime;
            const minLoadingTime = 5000; // 5 seconds
            
            if (elapsedTime < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
            }
            
            return data.reply;
        } catch (error) {
            console.error('Error calling chatbot API:', error);
            return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (inputValue.trim() && !isLoading) {
            const userMessage = inputValue.trim();
            setInputValue("");
            
            console.log("Current state - hasAskedForName:", hasAskedForName, "hasAskedForPhone:", hasAskedForPhone, "hasAskedForQuestion:", hasAskedForQuestion);
            console.log("User message:", userMessage);
            
            // Add user message to chat
            setMessages(prev => [...prev, { sender: "user", text: userMessage, option: selectedOption }]);
            
            // Check for conversation viewing commands
            const conversationCommands = ['show my conversations', 'my chats', 'view my chats', 'show conversations', 'my conversation history'];
            
            // Check for conversation command
            const isConversationCommand = conversationCommands.some(cmd => 
                userMessage.toLowerCase().includes(cmd.toLowerCase())
            );
            
            console.log("Conversation command check:", userMessage, isConversationCommand);
            
            if (isConversationCommand) {
                const userName = localStorage.getItem('userName');
                const userPhone = localStorage.getItem('userPhone');
                
                console.log("User data:", { userName, userPhone });
                
                if (userName && userPhone) {
                    // Removed the "Loading your conversations..." message
                    
                    // Fetch and display previous chats
                    const chats = await fetchPreviousChats(userName, userPhone);
                    console.log("Setting previous chats:", chats);
                    setPreviousChats(chats);
                    setShowPreviousChats(true);
                    console.log("Set showPreviousChats to true");
                    
                    // Add response message
                    if (chats.length > 0) {
                        // Removed the "Found X previous conversation(s). Here they are:" message
                    } else {
                        setMessages(prev => [...prev, { 
                            sender: "bot", 
                            text: "No previous conversations found for your account." 
                        }]);
                    }
                    return; // Exit early, don't call chatbot API
                } else {
                    // User hasn't provided info yet
                    setMessages(prev => [...prev, { 
                        sender: "bot", 
                        text: "Please provide your name and phone number first by selecting the 'Response' option from the main menu." 
                    }]);
                    return; // Exit early, don't call chatbot API
                }
            }
            

            
            // Check if we're in the fallback flow first
            if (hasAskedForName && !hasAskedForPhone && userMessage.length > 2) {
                console.log("Name provided, hasAskedForName:", hasAskedForName, "hasAskedForPhone:", hasAskedForPhone);
                // Extract name from the message (simple extraction)
                const nameMatch = userMessage.match(/(?:my name is|i'm|i am|name is)\s+([a-zA-Z\s]+)/i);
                const name = nameMatch ? nameMatch[1].trim() : userMessage.trim();
                
                console.log("Extracted name:", name);
                
                // Store the user's name
                setUserName(name);
                setHasAskedForPhone(true);
                
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: "bot", text: "Can you share your phone number?" }]);
                }, 1000);
                return; // Exit early, don't call API
            }
            
            // If user provides their phone number after being asked, validate and ask for question description
            if (hasAskedForPhone && !hasAskedForQuestion && (userMessage.match(/\d/) || userMessage.toLowerCase().includes("phone"))) {
                console.log("Phone provided, hasAskedForPhone:", hasAskedForPhone, "hasAskedForQuestion:", hasAskedForQuestion);
                // Extract phone number from the message (simple extraction)
                const phoneMatch = userMessage.match(/(\d[\d\s\-\(\)\+]+)/);
                const phoneNumber = phoneMatch ? phoneMatch[1].replace(/\s/g, '') : userMessage.trim();
                
                console.log("Extracted phone:", phoneNumber);
                
                // Validate phone number - must have at least 10 digits
                const digitCount = (phoneNumber.match(/\d/g) || []).length;
                console.log("Phone digit count:", digitCount);
                
                if (digitCount < 10) {
                    // Invalid phone number - ask for valid number
                    setTimeout(() => {
                        setMessages(prev => [...prev, { sender: "bot", text: "Please Provide valid Number", isValidationError: true }]);
                    }, 1000);
                    return; // Exit early, don't proceed to question
                }
                
                // Valid phone number - proceed to question
                setUserPhone(phoneNumber);
                setHasAskedForQuestion(true);
                console.log("Set hasAskedForQuestion to true");
                
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: "bot", text: "Please describe your question then check response after between 5 - 8 hours." }]);
                }, 1000);
                return; // Exit early, don't call API
            }
            
            // If user provides any response after being asked for question description, treat it as a question
            if (hasAskedForQuestion && userMessage.length > 0) {
                console.log("Question provided, hasAskedForQuestion:", hasAskedForQuestion, "hasAskedForPhone:", hasAskedForPhone, "message length:", userMessage.length);
                console.log("User message:", userMessage);
                console.log("User name:", userName, "User phone:", userPhone);
                
                // Record complete user information in the backend
                await recordUserInfo(userName, userPhone, userMessage);
                
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: "bot", text: "Thank you for your question, will get back to you soon. Check response by click on \"Response\" option", isThankYou: true }]);
                }, 1000);
                
                // Reset to show options after 12 seconds
                setTimeout(() => {
                    setHasAskedForName(false);
                    setHasAskedForPhone(false);
                    setHasAskedForQuestion(false);
                    setUserName("");
                    setUserPhone("");
                    setOptionsSelected(false);
                    setSelectedOption(null);
                    setMessages([]);
                }, 12000);
                return; // Exit early, don't call API
            }
            

            
            // Only call API if we're not in the fallback flow
            console.log("Calling API - hasAskedForQuestion:", hasAskedForQuestion, "userMessage length:", userMessage.length);
            const botResponse = await callChatbotAPI(userMessage, selectedOption);
            
            // Add bot response to chat
            setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
            
            // Check if the response is the fallback message and trigger name request
            if (botResponse.includes("No. Agent to assit you! Please back on this chat between 2 - 3 hours") && !hasAskedForName) {
                console.log("Fallback detected, setting hasAskedForName to true");
                setHasAskedForName(true);
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: "bot", text: "Please can you share your name?" }]);
                }, 2000); // 2 seconds delay
            }
        }
    };

    const handleOptionClick = async (option) => {
        // Special handling for "Response" option
        if (option === "Response") {
            setSelectedOption(option);
            setShowForm(true);
            setOptionsSelected(true); // This will hide the option list
            return;
        }

        // Regular handling for other options
        setMessages(prevMessages => [...prevMessages, { sender: "user", text: option, option: option }]);
        setSelectedOption(option);
        setOptionsSelected(true);

        // Call chatbot API with the selected option
        const botResponse = await callChatbotAPI(option, option);
        
        // Add bot response to chat
        setMessages(prevMessages => [...prevMessages, { sender: "bot", text: botResponse }]);
        
        // Check if the response is the fallback message and trigger name request
        if (botResponse.includes("No. Agent to assit you! Please back on this chat between 2 - 3 hours") && !hasAskedForName) {
            setHasAskedForName(true);
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Please can you share your name?" }]);
            }, 2000); // 2 seconds delay
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-toggle-btn" onClick={toggleChat}>
                {isOpen ? <AiOutlineClose size={20} color="#333" /> : <FaRegUser size={20} color="#333" />}
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header" style={{
                        backgroundColor: "#1e3a8a",
                        color: "white",
                        padding: "12px 16px",
                        borderRadius: "8px 8px 0 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "2px solid #0ea5e9"
                    }}>
                        <h3 style={{
                            margin: "0",
                            fontSize: "16px",
                            fontWeight: "600"
                        }}>Lycee St. Alexandre Sauli Al</h3>
                        <button 
                            onClick={toggleChat} 
                            className="close-btn"
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <AiOutlineClose size={18} />
                        </button>
                    </div>

                    {/* Messages Section with Scroll */}
                    <div className="chat-content" style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        {/* Default Message Section - Displayed at the top initially */}
                        {!optionsSelected && messages.length === 0 && !showPreviousChats && (
                            <div style={{ padding: "20px" }}>

                                
                                <p style={{ fontSize: "9px", color: "#fff", marginBottom: "10px" }}>
                                    This is Lycee AI! Before we get started, let's get to know each other.
                                </p>
                                <p style={{ fontSize: "9px", color: "yellow", marginBottom: "10px" }}>
                                    Which of these best describes you?
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {["Future Student", "Current Student", "Parent", "Lycee Teacher", "Response"].map(
                                        (option) => (
                                            <button
                                                key={option}
                                                onClick={() => handleOptionClick(option)}
                                                style={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #a52a2a",
                                                    color: "#a52a2a",
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {option}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Messages Section with Scroll */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender === "user" ? "receiver-message" : "sender-message"}`}>
                                    {/* Icon container */}
                                    <div className="icon-container">
                                        {msg.sender === "user" ? (
                                            // User Icon (reverted implementation with inline styles)
                                            <div
                                                className="user-profile-icon"
                                                style={{
                                                    backgroundColor: optionColors[msg.option] || "#ccc",
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%", // Ensure circular shape
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                <span style={{ marginTop: '0px' }}>👤</span>
                                            </div>
                                        ) : (
                                            // Bot Icon (placeholder emoji)
                                            <div className="bot-icon" style={{ fontSize: "30px", borderRadius: "50%" }}>🤖</div> // Added basic styling for circular shape
                                        )}
                                    </div>
                                    <div className={msg.sender === "user" ? "receiver" : "sender"}>
                                        {/* Only show text if it exists and no admin replies */}
                                        {msg.text && !msg.adminReplies && (
                                        <p 
                                            className={msg.isThankYou ? "thank-you-message" : msg.isValidationError ? "validation-error-message" : ""}
                                            style={{ 
                                                margin: 0, 
                                                fontSize: "8px", 
                                                color: msg.isThankYou || msg.isValidationError ? "#dc3545" : "#000" 
                                            }}
                                        >
                                            {msg.text}
                                            </p>
                                        )}
                                        
                                        {/* Admin Replies Display */}
                                        {msg.adminReplies && msg.adminReplies.length > 0 && (
                                            <div style={{ marginTop: "10px" }}>
                                                {msg.adminReplies.map((reply, replyIndex) => (
                                                    <div key={replyIndex} style={{
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        padding: "8px 12px",
                                                        borderRadius: "15px",
                                                        marginBottom: "8px",
                                                        border: "2px solid #20c997"
                                                    }}>
                                                        <p style={{
                                                            margin: "0 0 4px 0",
                                                            fontSize: "10px",
                                                            fontWeight: "bold",
                                                            opacity: 0.9
                                                        }}>
                                                            Admin Reply
                                                        </p>
                                                        <p style={{
                                                            margin: "0",
                                                            fontSize: "11px"
                                                        }}>
                                                            {reply.replyMessage}
                                                        </p>
                                                        <p style={{
                                                            margin: "4px 0 0 0",
                                                            fontSize: "9px",
                                                            opacity: 0.8
                                                        }}>
                                                            {new Date(reply.createdAt).toLocaleDateString()} {new Date(reply.createdAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} /> {/* Keep ref at the end for scrolling */}
                        
                        {/* Admin Replies Section */}
                        {showAdminReplies && adminReplies.length > 0 && (
                            <div style={{
                                margin: "10px",
                                padding: "12px",
                                backgroundColor: "rgba(14, 165, 233, 0.1)",
                                border: "1px solid rgba(14, 165, 233, 0.3)",
                                borderRadius: "6px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "8px"
                                }}>
                                    <h4 style={{ margin: "0", fontSize: "12px", color: "#0ea5e9", fontWeight: "600" }}>
                                        📬 Admin Replies ({adminReplies.length})
                                    </h4>
                                    <button
                                        onClick={() => {
                                            const storedConversationId = localStorage.getItem('conversationId');
                                            if (storedConversationId) {
                                                checkForAdminReplies(storedConversationId);
                                            }
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#0ea5e9",
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            textDecoration: "underline"
                                        }}
                                    >
                                        Refresh
                                    </button>
                                </div>
                                
                                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                    {adminReplies.map((reply, index) => (
                                        <div key={reply.id || index} style={{
                                            padding: "8px",
                                            marginBottom: "8px",
                                            backgroundColor: "white",
                                            borderRadius: "4px",
                                            border: "1px solid #dee2e6"
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "4px"
                                            }}>
                                                <span style={{
                                                    fontSize: "10px",
                                                    fontWeight: "600",
                                                    color: "#495057"
                                                }}>
                                                    {reply.repliedBy || 'Admin'}
                                                </span>
                                                <span style={{
                                                    fontSize: "9px",
                                                    color: "#6c757d"
                                                }}>
                                                    {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: "11px",
                                                color: "#212529",
                                                lineHeight: "1.3"
                                            }}>
                                                {reply.replyMessage}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Loading indicator for admin replies */}
                        {isLoadingReplies && (
                            <div style={{
                                margin: "10px",
                                padding: "8px",
                                textAlign: "center",
                                color: "#0ea5e9",
                                fontSize: "11px"
                            }}>
                                Checking for admin replies...
                            </div>
                        )}
                        
                        {/* Loading indicator with animated dots */}
                        {isLoading && (
                            <div className="message sender-message">
                                <div className="icon-container">
                                    <div className="bot-icon" style={{ fontSize: "30px", borderRadius: "50%" }}>🤖</div>
                                </div>
                                <div className="sender">
                                    <p style={{ margin: 0, fontSize: "12px", color: "#000" }}>
                                        <span className="animated-dots">
                                            Finding response
                                            <span className="dot">.</span>
                                            <span className="dot">.</span>
                                            <span className="dot">.</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Form */}
                        {showForm && (
                            <div style={{ 
                                padding: "20px", 
                                backgroundColor: "#f8f9fa", 
                                border: "1px solid #dee2e6",
                                borderRadius: "8px",
                                margin: "10px"
                            }}>
                                <div style={{ 
                                    textAlign: "center", 
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "5px"
                                }}>
                                    <p style={{ 
                                        fontSize: "12px", 
                                        color: "#495057", 
                                        margin: "0 0 5px 0" 
                                    }}>
                                        Response Form
                                    </p>
                                    <p style={{ 
                                        fontSize: "10px", 
                                        color: "#6c757d", 
                                        margin: "0" 
                                    }}>
                                        Please provide your contact information
                                    </p>
                                </div>
                                <h4 style={{ 
                                    fontSize: "14px", 
                                    color: "#333", 
                                    marginBottom: "15px",
                                    textAlign: "center"
                                }}>
                                    Verify
                                </h4>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ 
                                        display: "block", 
                                        fontSize: "12px", 
                                        color: "#555", 
                                        marginBottom: "5px" 
                                    }}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleFormInputChange("name", e.target.value)}
                                        placeholder="Enter your full name"
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            fontSize: "12px"
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ 
                                        display: "block", 
                                        fontSize: "12px", 
                                        color: "#555", 
                                        marginBottom: "5px" 
                                    }}>
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleFormInputChange("phoneNumber", e.target.value)}
                                        placeholder="Enter your phone number"
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            fontSize: "12px"
                                        }}
                                    />
                                </div>
                                <div style={{ 
                                    display: "flex", 
                                    gap: "10px",
                                    justifyContent: "center"
                                }}>
                                    <button
                                        onClick={handleFormSubmit}
                                        disabled={!formData.name.trim() || !formData.phoneNumber.trim()}
                                        style={{
                                            backgroundColor: "#8A2BE2",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: formData.name.trim() && formData.phoneNumber.trim() ? "pointer" : "not-allowed",
                                            fontSize: "12px",
                                            opacity: formData.name.trim() && formData.phoneNumber.trim() ? 1 : 0.6
                                        }}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={handleFormCancel}
                                        style={{
                                            backgroundColor: "#6c757d",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Previous Chats Display */}
                        {showPreviousChats && (
                            <div style={{ 
                                padding: "15px", 
                                margin: "10px",
                                textAlign: "center"
                            }}>
                                <AdminResponseDisplay 
                                    userName={localStorage.getItem('userName')} 
                                    userPhone={localStorage.getItem('userPhone')} 
                                />

                                {/* Chat and Cancel buttons */}
                                <div style={{ 
                                    display: "flex", 
                                    gap: "10px",
                                    justifyContent: "center"
                                }}>
                                    <button
                                        onClick={handleBackToChat}
                                        style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                        }}
                                    >
                                        Chat
                                    </button>
                                    <button
                                        onClick={handleBackToChat}
                                        style={{
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Chat Footer - Hide when Response form or Previous chats are shown */}
                    {!showForm && !showPreviousChats && (
                    <div className="chat-footer">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSend();
                                    }
                                }}
                                className="input-field"
                            />
                            <div className="input-icons">
                                <FaRegSmile className="icon-emoji" />
                            </div>
                        </div>
                            <button 
                                onClick={handleSend} 
                                className="send-btn"
                                disabled={isLoading || !inputValue.trim()}
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "6px 12px",
                                    cursor: (isLoading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    minWidth: "50px",
                                    opacity: (isLoading || !inputValue.trim()) ? 0.6 : 1,
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
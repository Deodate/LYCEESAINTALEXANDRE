import React, { useState, useRef, useEffect } from "react";
import { FaRegUser, FaRegSmile } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import "./ChatbotInterface.css";

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [optionsSelected, setOptionsSelected] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    // Map options to colors
    const optionColors = {
        "Future Student": "#FF6347", // Tomato
        "Current Student": "#4682B4", // SteelBlue
        "Parent": "#32CD32", // LimeGreen
        "Lycee Teacher": "#FFD700", // Gold
        "Alumni": "#8A2BE2", // BlueViolet
        "Option": "#00CED1", // DarkTurquoise (fallback/default for the extra option)
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { sender: "user", text: inputValue, option: selectedOption }]);
            setInputValue("");
        }
    };

    const handleOptionClick = (option) => {
        // Add the user's selected option as a message
        setMessages(prevMessages => [...prevMessages, { sender: "user", text: option, option: option }]);
        setSelectedOption(option);
        setOptionsSelected(true);

        // Add the default chatbot response after a short delay (optional, for better UX)
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "This is Lycee Saint Alexandre, How can we help you today?" }]);

            // Add the second message after 5 seconds
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Which your name please?" }]);
            }, 5000); // 5-second delay for the second message

        }, 500); // Add a slight delay of 500ms for the first message

        // Optionally, you might want to send this option to your backend/AI service
        // sendToChatbotAPI(option);
    };

    return (
        <div className="chat-container">
            <div className="chat-toggle-btn" onClick={toggleChat}>
                {isOpen ? <AiOutlineClose size={20} color="#333" /> : <FaRegUser size={20} color="#333" />}
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Lycee St. Alexandre Sauli AI</h3>
                        <button onClick={toggleChat} className="close-btn">
                            <AiOutlineClose />
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
                        {!optionsSelected && messages.length === 0 && (
                            <div style={{ padding: "20px" }}>
                                <p style={{ fontSize: "9px", color: "#fff", marginBottom: "10px" }}>
                                    This is Lycee AI! Before we get started, let's get to know each other.
                                </p>
                                <p style={{ fontSize: "9px", color: "yellow", marginBottom: "10px" }}>
                                    Which of these best describes you?
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {["Future Student", "Current Student", "Parent", "Lycee Teacher", "Alumni"].map(
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
                                        <p style={{ margin: 0, fontSize: "8px", color: "#000" }}>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} /> {/* Keep ref at the end for scrolling */}

                    </div>

                    {/* Chat Footer */}
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
                        <button onClick={handleSend} className="send-btn">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
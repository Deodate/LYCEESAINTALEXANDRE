import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MessageCircle, Clock, Users, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';
import './AIChat.css';

const AIChat = () => {
  const navigate = useNavigate();
  const { markAsRead, setTotalUnreadCount, updateConversations } = useNotifications();
  const [conversations, setConversations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [allConversations, setAllConversations] = useState([]); // Store all conversations for filtering
  const [filteredConversations, setFilteredConversations] = useState([]); // Store filtered conversations
  const [statistics, setStatistics] = useState({
    totalConversations: 0,
    thisMonthConversations: 0,
    avgResponseTime: 2.3,
    satisfaction: 4.8
  });

  // Animated statistics for counting effect
  const [animatedStats, setAnimatedStats] = useState({
    totalConversations: 0,
    thisMonthConversations: 0,
    avgResponseTime: 0
  });
  
  // Reply dialog state
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // Read state for masking messages
  const [readConversations, setReadConversations] = useState(new Set());
  const [readTimestamps, setReadTimestamps] = useState({}); // Track when conversations were read
  
  // Reply state
  const [conversationReplies, setConversationReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const itemsPerPage = 3;

  // Animation effect for statistics counting
  useEffect(() => {
    const animateStats = () => {
      const duration = 5000; // 5 seconds for counting animation
      const steps = 60; // 60 steps for smooth animation
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        const progress = currentStep / steps;
        
        setAnimatedStats({
          totalConversations: Math.floor(statistics.totalConversations * progress),
          thisMonthConversations: Math.floor(statistics.thisMonthConversations * progress),
          avgResponseTime: parseFloat((statistics.avgResponseTime * progress).toFixed(1))
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          
          // Set final values
          setAnimatedStats({
            totalConversations: statistics.totalConversations,
            thisMonthConversations: statistics.thisMonthConversations,
            avgResponseTime: statistics.avgResponseTime
          });
          
          // Wait 20 seconds (20000ms) before restarting animation
          setTimeout(() => {
            // Reset to 0 and restart animation
            setAnimatedStats({
              totalConversations: 0,
              thisMonthConversations: 0,
              avgResponseTime: 0
            });
            
            // Restart animation after a short delay
            setTimeout(animateStats, 100);
          }, 20000);
        }
      }, stepDuration);
    };
    
    // Start animation when statistics change
    if (statistics.totalConversations > 0) {
      animateStats();
    }
  }, [statistics]);

  // Update unread count whenever readConversations or conversations change
  useEffect(() => {
    if (allConversations.length > 0) {
      const unreadCount = allConversations.length - readConversations.size;
      setTotalUnreadCount(Math.max(0, unreadCount));
      console.log(`📊 Updated unread count: ${unreadCount} (${allConversations.length} total - ${readConversations.size} read)`);
    }
  }, [readConversations, allConversations, setTotalUnreadCount]);

  // Initial unread count update when component loads
  useEffect(() => {
    if (readConversations.size > 0 && allConversations.length === 0) {
      // If we have read conversations but no conversations loaded yet, 
      // we need to fetch conversations to calculate the unread count
      fetchConversations();
    }
  }, [readConversations]);

  const fetchConversations = async (page = 0) => {
    try {
      setLoading(true);
      
      // First, fetch all conversations to get the total unread count
      const allResponse = await fetch('http://localhost:9090/api/v1/chat-conversation/all?page=0&size=1000');
      let totalUnreadCount = 0;
      
      if (allResponse.ok) {
        const allData = await allResponse.json();
        console.log('📊 AIChat: All conversations API Response:', allData);
        
        let totalConversations = 0;
        
        // Handle paginated response format
        if (allData.data && allData.data.content && Array.isArray(allData.data.content)) {
          totalConversations = allData.data.totalElements || allData.data.content.length;
          console.log(`📊 AIChat: Found ${totalConversations} total conversations (paginated format)`);
        } 
        // Handle flat array format (fallback)
        else if (allData.data && Array.isArray(allData.data)) {
          totalConversations = allData.data.length;
          console.log(`📊 AIChat: Found ${totalConversations} total conversations (flat format)`);
        }
        
        if (totalConversations > 0) {
          // Calculate total unread count from all conversations
          totalUnreadCount = totalConversations - readConversations.size;
          setTotalUnreadCount(Math.max(0, totalUnreadCount));
          console.log(`📊 AIChat: Total unread count: ${totalUnreadCount} (${totalConversations} total - ${readConversations.size} read)`);
        }
      }
      
      // Then fetch paginated conversations for display
      const response = await fetch(`http://localhost:9090/api/v1/chat-conversation/all?page=${page}&size=${itemsPerPage}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Handle both response formats
        if (data.data && Array.isArray(data.data)) {
          // Current format: flat array
          setConversations(data.data);
          setAllConversations(data.data); // Store all conversations
          setFilteredConversations(data.data); // Initially show all conversations
          setTotalPages(Math.ceil(data.data.length / itemsPerPage));
          updateConversations(data.data);
        } else if (data.data && data.data.content) {
          // Expected format: paginated object
          setConversations(data.data.content || []);
          setAllConversations(data.data.content || []); // Store all conversations
          setFilteredConversations(data.data.content || []); // Initially show all conversations
          setTotalPages(data.data.totalPages || 0);
          updateConversations(data.data.content || []);
        } else {
          // Fallback
          setConversations([]);
          setAllConversations([]);
          setFilteredConversations([]);
          setTotalPages(0);
          setTotalUnreadCount(0);
          updateConversations([]);
        }
        setCurrentPage(page);
      } else {
        console.error('API Error:', response.status, response.statusText);
        setConversations([]);
        setAllConversations([]);
        setFilteredConversations([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
      setAllConversations([]);
      setFilteredConversations([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/v1/chat-conversation/statistics');
      if (response.ok) {
        const data = await response.json();
        console.log('Statistics Response:', data); // Debug log
        setStatistics(data.data || {
          totalConversations: 0,
          thisMonthConversations: 0,
          avgResponseTime: 2.3,
          satisfaction: 4.8
        });
      } else {
        console.error('Statistics API Error:', response.status, response.statusText);
        // Set default statistics
        setStatistics({
          totalConversations: 0,
          thisMonthConversations: 0,
          avgResponseTime: 2.3,
          satisfaction: 4.8
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Set default statistics
      setStatistics({
        totalConversations: 0,
        thisMonthConversations: 0,
        avgResponseTime: 2.3,
        satisfaction: 4.8
      });
    }
  };

  useEffect(() => {
    // Load read conversations from localStorage first
    const savedReadConversations = localStorage.getItem('readConversations');
    if (savedReadConversations) {
      try {
        const readIds = JSON.parse(savedReadConversations);
        setReadConversations(new Set(readIds));
        console.log(`📚 Loaded ${readIds.length} read conversations from localStorage`);
      } catch (error) {
        console.error('Error loading read conversations from localStorage:', error);
      }
    }
    
    // Load read timestamps from localStorage
    const savedReadTimestamps = localStorage.getItem('readTimestamps');
    if (savedReadTimestamps) {
      try {
        const timestamps = JSON.parse(savedReadTimestamps);
        setReadTimestamps(timestamps);
      } catch (error) {
        console.error('Error loading read timestamps from localStorage:', error);
      }
    }
    
    // Then fetch conversations and statistics
    fetchConversations();
    fetchStatistics();
  }, []);

  // Debug effect to log conversations when they change
  useEffect(() => {
    console.log('Conversations state updated:', {
      conversations: conversations,
      length: conversations.length,
      currentPage: currentPage,
      totalPages: totalPages
    });
  }, [conversations, currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchConversations(page);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Reply dialog functions
  const handleReplyClick = (conversation) => {
    setSelectedConversation(conversation);
    setReplyMessage('');
    setShowReplyDialog(true);
  };

  const handleCloseReplyDialog = () => {
    setShowReplyDialog(false);
    setSelectedConversation(null);
    setReplyMessage('');
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setIsSubmittingReply(true);
    try {
      // Send reply to the backend API
      const response = await fetch('http://localhost:9090/api/v1/chat-conversation/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        conversationId: selectedConversation.id,
          replyMessage: replyMessage,
          repliedBy: 'Admin' // You can make this dynamic based on logged-in user
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reply sent successfully:', data);

      // Close dialog and show success message
      handleCloseReplyDialog();
      alert('Reply sent successfully!');
      
        // Refresh conversations and replies
      fetchConversations(currentPage);
        if (selectedConversation) {
          fetchConversationReplies(selectedConversation.id);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert(`Failed to send reply: ${error.message}`);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Read button functionality
  const handleReadClick = (conversation) => {
    // Mark conversation as read
    setReadConversations(prev => {
      const newSet = new Set([...prev, conversation.id]);
      // Save to localStorage
      localStorage.setItem('readConversations', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
    
    // Record timestamp when conversation was read
    setReadTimestamps(prev => {
      const newTimestamps = {
        ...prev,
        [conversation.id]: Date.now()
      };
      // Save to localStorage
      localStorage.setItem('readTimestamps', JSON.stringify(newTimestamps));
      return newTimestamps;
    });
    
    // Update notification count
    markAsRead(conversation.id);
    
    // Schedule conversation to move to end after 1 minute
    setTimeout(() => {
      moveConversationToEnd(conversation.id);
    }, 60000); // 1 minute = 60000ms
    
    console.log(`Conversation ${conversation.id} marked as read`);
  };

  // Move conversation to the end of the list
  const moveConversationToEnd = (conversationId) => {
    setConversations(prevConversations => {
      const conversation = prevConversations.find(c => c.id === conversationId);
      if (!conversation) return prevConversations;
      
      const filteredConversations = prevConversations.filter(c => c.id !== conversationId);
      return [...filteredConversations, conversation];
    });
    
    setAllConversations(prevConversations => {
      const conversation = prevConversations.find(c => c.id === conversationId);
      if (!conversation) return prevConversations;
      
      const filteredConversations = prevConversations.filter(c => c.id !== conversationId);
      return [...filteredConversations, conversation];
    });
    
    setFilteredConversations(prevConversations => {
      const conversation = prevConversations.find(c => c.id === conversationId);
      if (!conversation) return prevConversations;
      
      const filteredConversations = prevConversations.filter(c => c.id !== conversationId);
      return [...filteredConversations, conversation];
    });
  };

  // Check if conversation is read
  const isConversationRead = (conversationId) => {
    return readConversations.has(conversationId);
  };

  // Search function to filter conversations by name
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      // If search is empty, show all conversations
      setFilteredConversations(allConversations);
      setConversations(allConversations);
      setTotalPages(Math.ceil(allConversations.length / itemsPerPage));
    } else {
      // Filter conversations by name (case-insensitive)
      const filtered = allConversations.filter(conversation => 
        conversation.name && 
        conversation.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setFilteredConversations(filtered);
      setConversations(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(0); // Reset to first page when searching
    }
  };

  // Clear search function
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredConversations(allConversations);
    setConversations(allConversations);
    setTotalPages(Math.ceil(allConversations.length / itemsPerPage));
    setCurrentPage(0);
  };

  // Fetch replies for a conversation
  const fetchConversationReplies = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:9090/api/v1/chat-conversation/${conversationId}/replies`);
      if (response.ok) {
        const data = await response.json();
        setConversationReplies(prev => ({
          ...prev,
          [conversationId]: data.data || []
        }));
      } else {
        console.error('Failed to fetch replies for conversation:', conversationId);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  // Toggle replies display for a conversation
  const toggleReplies = (conversationId) => {
    setShowReplies(prev => ({
      ...prev,
      [conversationId]: !prev[conversationId]
    }));
    
    // Fetch replies if not already loaded
    if (!conversationReplies[conversationId]) {
      fetchConversationReplies(conversationId);
    }
  };

  // Format date for replies
  const formatReplyDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ai-chat-container">
      {/* Header */}
      <div className="chat-header" style={{
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "16px 24px",
        borderRadius: "8px 8px 0 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #0ea5e9"
      }}>
        <div className="header-left" style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <button 
            className="back-btn" 
            onClick={() => navigate('/dashboard')}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px"
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <h1 style={{
            margin: "0",
            fontSize: "20px",
            fontWeight: "600"
          }}>Lycee St. Alexandre Sauli Al</h1>
        </div>
        
        <div className="header-right">
          <div className="search-container" style={{
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <Search size={18} style={{ position: "absolute", left: "12px", color: "#9ca3af", zIndex: 1 }} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                padding: "8px 12px 8px 36px",
                borderRadius: "6px",
                fontSize: "14px",
                width: "250px"
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="statistics-section">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <div className="stat-value" style={{ color: '#dc3545' }}>{animatedStats.totalConversations}</div>
            <div className="stat-label">Total Conversations</div>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={24} />
          <div>
            <div className="stat-value" style={{ color: '#dc3545' }}>{animatedStats.thisMonthConversations}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock size={24} />
          <div>
            <div className="stat-value" style={{ color: '#dc3545' }}>{animatedStats.avgResponseTime}s</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="chat-list-section">
        {/* Search Results Indicator */}
        {searchTerm && (
          <div style={{
            padding: "12px 16px",
            backgroundColor: "rgba(14, 165, 233, 0.1)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            borderRadius: "6px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ color: "#0ea5e9", fontSize: "14px" }}>
              Search results for "{searchTerm}": {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={clearSearch}
              style={{
                background: "none",
                border: "none",
                color: "#0ea5e9",
                cursor: "pointer",
                fontSize: "12px",
                textDecoration: "underline"
              }}
            >
              Clear search
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="loading">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircle size={48} />
            <h3>{searchTerm ? 'No matching conversations found' : 'No conversations found'}</h3>
            <p>{searchTerm ? `No conversations found matching "${searchTerm}". Try a different search term.` : 'Start chatting with our AI to see conversations here.'}</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="conversation-item">
                <div className="conversation-header">
                  <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div>
                      <div className="user-name">{conversation.name}</div>
                      <div className="user-phone">{conversation.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="conversation-meta">
                    <div className="timestamp">
                      <Clock size={14} />
                      {formatDate(conversation.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="conversation-content">
                  {readConversations.has(conversation.id) ? (
                    // Show content when read
                    <>
                  <div className="question">
                    <strong>Q:</strong> {conversation.question}
                  </div>
                  <div className="answer">
                    <strong>A:</strong> {conversation.answer || 'No response recorded'}
                  </div>
                    </>
                  ) : (
                    // Hide content with placeholder
                    <div style={{
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "6px",
                      border: "1px solid #e9ecef"
                    }}>
                      <div style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        marginBottom: "8px"
                      }}>
                        🔒 Message Hidden
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#adb5bd"
                      }}>
                        Click "Read" to view the conversation content
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="conversation-actions">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => handleReadClick(conversation)}
                    style={{
                      backgroundColor: readConversations.has(conversation.id) ? "#28a745" : "#007bff",
                      color: "white"
                    }}
                  >
                    {readConversations.has(conversation.id) ? 'Read ✓' : 'Read'}
                  </button>
                                          <button 
                          className="action-btn export-btn" 
                          onClick={() => handleReplyClick(conversation)}
                    disabled={!readConversations.has(conversation.id)}
                    style={{
                      backgroundColor: readConversations.has(conversation.id) ? "#28a745" : "#adb5bd",
                      color: "white",
                      cursor: readConversations.has(conversation.id) ? "pointer" : "not-allowed",
                      opacity: readConversations.has(conversation.id) ? 1 : 0.6
                    }}
                        >
                          Reply
                        </button>
                  <button 
                    className="action-btn view-replies-btn" 
                    onClick={() => toggleReplies(conversation.id)}
                    disabled={!readConversations.has(conversation.id)}
                    style={{
                      backgroundColor: readConversations.has(conversation.id) 
                        ? (showReplies[conversation.id] ? "#0ea5e9" : "#6c757d")
                        : "#adb5bd",
                      color: "white",
                      cursor: readConversations.has(conversation.id) ? "pointer" : "not-allowed",
                      opacity: readConversations.has(conversation.id) ? 1 : 0.6
                    }}
                  >
                    {showReplies[conversation.id] ? 'Hide Replies' : 'View Replies'}
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    disabled={!readConversations.has(conversation.id)}
                    style={{
                      backgroundColor: readConversations.has(conversation.id) ? "#dc3545" : "#adb5bd",
                      color: "white",
                      cursor: readConversations.has(conversation.id) ? "pointer" : "not-allowed",
                      opacity: readConversations.has(conversation.id) ? 1 : 0.6
                    }}
                  >
                    Delete
                  </button>
                </div>

                {/* Replies Section */}
                {showReplies[conversation.id] && readConversations.has(conversation.id) && (
                  <div className="replies-section" style={{
                    marginTop: "12px",
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #e9ecef"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px"
                    }}>
                      <h4 style={{ margin: "0", fontSize: "14px", color: "#495057" }}>
                        Replies ({conversationReplies[conversation.id]?.length || 0})
                      </h4>
                      <button
                        onClick={() => fetchConversationReplies(conversation.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0ea5e9",
                          cursor: "pointer",
                          fontSize: "12px",
                          textDecoration: "underline"
                        }}
                      >
                        Refresh
                      </button>
                    </div>
                    
                    {conversationReplies[conversation.id] && conversationReplies[conversation.id].length > 0 ? (
                      <div className="replies-list">
                        {conversationReplies[conversation.id].map((reply, index) => (
                          <div key={reply.id || index} className="reply-item" style={{
                            padding: "8px 12px",
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
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#495057"
                              }}>
                                {reply.repliedBy || 'Admin'}
                              </span>
                              <span style={{
                                fontSize: "11px",
                                color: "#6c757d"
                              }}>
                                {formatReplyDate(reply.createdAt)}
                              </span>
                            </div>
                            <div style={{
                              fontSize: "13px",
                              color: "#212529",
                              lineHeight: "1.4"
                            }}>
                              {reply.replyMessage}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: "center",
                        padding: "16px",
                        color: "#6c757d",
                        fontSize: "14px"
                      }}>
                        No replies yet. Be the first to reply!
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && conversations.length > 0 && totalPages > 1 && (
        <div className="pagination-section">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Reply Dialog */}
      {showReplyDialog && (
        <div className="reply-dialog-overlay">
          <div className="reply-dialog">
            <div className="reply-dialog-header">
              <h3>Reply to {selectedConversation?.name}</h3>
              <button 
                className="close-btn" 
                onClick={handleCloseReplyDialog}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="reply-dialog-content">
              <div className="conversation-preview">
                <div className="preview-question">
                  <strong>Q:</strong> {selectedConversation?.question}
                </div>
                <div className="preview-answer">
                  <strong>A:</strong> {selectedConversation?.answer || 'No response recorded'}
                </div>
              </div>
              
              <div className="reply-form">
                <label htmlFor="reply-message">Your Reply:</label>
                <textarea
                  id="reply-message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply message here..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="reply-dialog-actions">
              <button 
                className="cancel-btn" 
                onClick={handleCloseReplyDialog}
                disabled={isSubmittingReply}
              >
                Cancel
              </button>
              <button 
                className="send-btn" 
                onClick={handleSubmitReply}
                disabled={isSubmittingReply || !replyMessage.trim()}
              >
                {isSubmittingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;

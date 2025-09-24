import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState([]);

  // Load unread count from localStorage on mount
  useEffect(() => {
    const savedUnreadCount = localStorage.getItem('unreadConversationsCount');
    if (savedUnreadCount) {
      setUnreadCount(parseInt(savedUnreadCount) || 0);
      console.log(`🔔 NotificationContext: Loaded unread count from localStorage: ${savedUnreadCount}`);
    } else {
      console.log(`🔔 NotificationContext: No saved unread count found in localStorage`);
    }
  }, []);

  // Debug effect to track unreadCount changes
  useEffect(() => {
    console.log(`🔔 NotificationContext: unreadCount state changed to: ${unreadCount}`);
  }, [unreadCount]);

  // Update unread count and save to localStorage
  const updateUnreadCount = (count) => {
    setUnreadCount(count);
    localStorage.setItem('unreadConversationsCount', count.toString());
  };

  // Mark conversation as read
  const markAsRead = (conversationId) => {
    setUnreadCount(prev => {
      const newCount = Math.max(0, prev - 1);
      localStorage.setItem('unreadConversationsCount', newCount.toString());
      return newCount;
    });
  };

  // Set total unread count (used when fetching conversations)
  const setTotalUnreadCount = (count) => {
    console.log(`🔔 NotificationContext: Setting unread count to ${count}`);
    setUnreadCount(count);
    localStorage.setItem('unreadConversationsCount', count.toString());
    console.log(`🔔 NotificationContext: Updated localStorage with count ${count}`);
  };

  // Update conversations list
  const updateConversations = (newConversations) => {
    setConversations(newConversations);
  };

  const value = {
    unreadCount,
    conversations,
    updateUnreadCount,
    markAsRead,
    setTotalUnreadCount,
    updateConversations
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

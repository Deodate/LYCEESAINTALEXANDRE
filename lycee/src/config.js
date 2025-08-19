// Base URLs for services
// Prefer setting env vars over hardcoding:
// - REACT_APP_BACKEND_BASE_URL (Spring Boot, default 9090)
// - REACT_APP_CHATBOT_BASE_URL (Python AI chatbot, default 8000)

export const BACKEND_BASE_URL =
  process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:9090';

export const CHATBOT_BASE_URL =
  process.env.REACT_APP_CHATBOT_BASE_URL || 'http://localhost:8000';

// Backward compatibility: some code might still import API_BASE_URL for chatbot
export const API_BASE_URL = CHATBOT_BASE_URL;



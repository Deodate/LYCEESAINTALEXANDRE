import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown, Bell } from 'lucide-react';
import logo from '../../../assets/images/logo-black.png';
import StaffManagement from '../Authentications/StaffManagement';
import BabyeyiLetter from '../Babyeyi/BabyeyiLetter';
import Comments from '../Authentications/comments';
import GalleryManagement from '../Authentications/gallery';
import NewsEventsManagement from '../Authentications/newsEvents';
import { Link } from 'react-router-dom';
import StudentList from '../Authentications/studentsList';
import DioceseByumba from '../DioceseByumba/DioceseByumba';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load user information from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('🔍 Loading user data from localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('✅ Parsed user data:', user);
        
        setUserInfo({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        });
        
        console.log('👤 Set user info:', {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        });
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
      }
    } else {
      console.log('⚠️ No user data found in localStorage');
    }
  }, []);

  // Generate initials from first and last name
  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Call the backend logout API
        const response = await fetch('http://localhost:9090/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Logout API response:', response.status);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    }
    
    // Wait for 5 seconds with loading animation
    setTimeout(() => {
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('babyeyiGeneratedPDF');
      localStorage.removeItem('babyeyiContent');
      
      // Close dropdown
      setIsProfileOpen(false);
      
      // Navigate to signin page
      navigate('/signin');
    }, 5000);
  };

    // Quick authentication check for direct URL access
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!token || !isLoggedIn) {
      console.log('No authentication found, redirecting to signin');
      navigate("/signin", { state: { from: { pathname: '/dashboard' } } });
      return;
    }

    // Validate token format and expiration
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('Invalid token format');
        navigate("/signin", { state: { from: { pathname: '/dashboard' } } });
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp < currentTime) {
        console.log('Token expired');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        navigate("/signin", { state: { from: { pathname: '/dashboard' } } });
        return;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      navigate("/signin", { state: { from: { pathname: '/dashboard' } } });
      return;
    }
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Example function to demonstrate use of setNotificationCount
  const updateNotifications = () => {
    // Simulate updating notification count, e.g., after reading notifications
    setNotificationCount(prevCount => Math.max(0, prevCount - 1));
  };

  return (
    <div className="dashboard-container">
      {/* Background Logo */}
      <div
        className="background-logo"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
        }}
      />

      {/* Top Navigation */}
      <div className={`dashboard-top-nav ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="dashboard-top-left">
          <button
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            className="dashboard-menu-button"
          >
            <Menu size={24} />
          </button>
          <span className="dashboard-title">ADMIN DASHBOARD</span>
        </div>
        <div className="dashboard-top-right">
          <Link to="/student-lists" className="student-list-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Student List
          </Link>

          {/* Notification Icon */}
          <div className="notification-bell" onClick={updateNotifications}>
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="profile-button"
            >
              <div className="profile-avatar">{getInitials(userInfo.firstName, userInfo.lastName)}</div>
              <div className="profile-info">
                <span className="profile-name">
                  {userInfo.firstName && userInfo.lastName 
                    ? `${userInfo.firstName} ${userInfo.lastName}`
                    : userInfo.firstName || userInfo.lastName || 'User'
                  }
                </span>
                <span className="profile-email">{userInfo.email || 'No email'}</span>
              </div>
              <ChevronDown size={16} className={isProfileOpen ? 'rotate-180' : ''} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="profile-dropdown-menu">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="dropdown-item logout-item"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <div className="loading-circle"></div>
                  ) : (
                    <LogOut size={16} />
                  )}
                  <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      <div className={`dashboard-sidebar ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-nav">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'about', label: 'About', icon: 'ℹ️' },
            { id: 'staff', label: 'Staff', icon: '👩‍🏫' },
            { id: 'babyeyi', label: 'Babyeyi', icon: '🧒' },
            { id: 'comments', label: 'AI Chat', icon: '🤖' },
            { id: 'gallery', label: 'Gallery', icon: '📸' },
            { id: 'header', label: 'Header', icon: '🔝' },
            { id: 'student-lists', label: 'Student List', icon: '🔽' },
            { id: 'contact', label: 'Contact', icon: '📞' },
            { id: 'newsEvents', label: 'News & Events', icon: '📰' },
            { id: 'StudentLife', label: 'Students Life', icon: '❓' },
            { id: 'diocese', label: 'Diocese Byumba', icon: '⛪' },
            { id: 'logout', label: 'Logout', icon: '⛔' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(activeMenu === item.id ? '' : item.id)}
              className={`sidebar-nav-item ${activeMenu === item.id ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-text">{item.label}</span>
              {!isNavExpanded && (
                <div className="sidebar-tooltip">{item.label}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`dashboard-main-content ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
        {activeMenu === 'about' && (
          <div className="content-card">
            <h2>Update/ Current Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Vision and Values</label>
                <textarea
                  className="form-input"
                  placeholder="Vision and Values"
                />
              </div>
              <div className="form-group">
                <label className="form-label">History & Location</label>
                <textarea
                  className="form-input"
                  placeholder="History & Location"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary">Clear Filter</button>
              <button className="btn btn-primary">Update</button>
            </div>
          </div>
        )}

        {activeMenu === 'staff' && (
          <StaffManagement />
        )}

        {activeMenu === 'babyeyi' && (
          <BabyeyiLetter />
        )}

        {activeMenu === 'comments' && (
          <Comments />
        )}

        {activeMenu === 'gallery' && (
          <GalleryManagement />
        )}

        {activeMenu === 'newsEvents' && (
          <NewsEventsManagement />
        )}

        {activeMenu === 'student-lists' && (
          <StudentList />
        )}

        {activeMenu === 'diocese' && (
          <DioceseByumba />
        )}

        {activeMenu === 'home' && (
          <div className="content-card">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Select a menu item from the sidebar to get started.</p>
          </div>
        )}

        {!activeMenu && (
          <div className="content-card">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Select a menu item from the sidebar to get started.</p>
          </div>
        )}
      </div>

      {/* Full-screen Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="logout-overlay">
          <div className="logout-loading-container">
            <div className="logout-loading-circle"></div>
            <p className="logout-loading-text">Signing out...</p>
            <p className="logout-loading-subtext">Please wait while we secure your session</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
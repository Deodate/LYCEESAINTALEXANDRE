import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, clearAuthToken } from '../../utils/authSession';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const token = getAuthToken();
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (!token || isLoggedIn !== 'true') {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token format and expiration
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.log('Invalid token format');
          clearAuthToken();
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp < currentTime) {
            console.log('Token expired');
            clearAuthToken();
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }

          setIsAuthenticated(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Token validation error:', error);
          clearAuthToken();
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin page with the current location as the redirect path
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

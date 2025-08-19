import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css'; // Import App.css for styling

const Signin = () => {
  const [activeTab, setActiveTab] = useState('login'); // State to track active tab
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Loading state for login
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  const isRedirected = location.state?.from;

  // State for signup form fields
  const [signupFormData, setSignupFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    position: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '',
  });

  // State for signup form validation errors
  const [signupFormErrors, setSignupFormErrors] = useState({});

  // State for login form fields
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });

  // State for login form validation errors
  const [loginFormErrors, setLoginFormErrors] = useState({});

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Optionally reset form data and errors when switching tabs
    setSignupFormData({
      firstName: '',
      lastName: '',
      gender: '',
      position: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      countryCode: '',
    });
    setSignupFormErrors({});
    // Reset login form data and errors when switching tabs
    setLoginFormData({
      username: '',
      password: '',
    });
    setLoginFormErrors({});
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData({
      ...signupFormData,
      [name]: value,
    });
    // Clear error for the field as user types
    if (signupFormErrors[name]) {
      setSignupFormErrors({
        ...signupFormErrors,
        [name]: '',
      });
    }
  };

  // Handler for login form input changes
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
    // Clear error for the field as user types
    if (loginFormErrors[name]) {
      setLoginFormErrors({
        ...loginFormErrors,
        [name]: '',
      });
    }
  };

  const validateSignupForm = () => {
    const errors = {};
    const { firstName, lastName, /* gender, */ position, phoneNumber, email, password, confirmPassword } = signupFormData;

    // First Name validation: Only characters
    if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      errors.firstName = 'Invalid characters';
    }

    // Last Name validation: Only characters
    if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      errors.lastName = 'Invalid characters';
    }

    // Position validation: Only characters
    if (!/^[a-zA-Z\s]+$/.test(position)) {
      errors.position = 'Invalid characters';
    }

    // Phone Number validation: Only numbers and exactly 10 digits with country code
    if (!/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber = 'Only numbers allowed';
    } else if (signupFormData.countryCode && phoneNumber.length !== 10) {
      errors.phoneNumber = 'Phone number must be 10 digits long';
    }

    // Email validation: Valid email format
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation: (Add your password strength rules here if needed)
    // For now, just checking if it's not empty
    if (!password) {
        errors.password = 'Password is required';
    }

    // Confirm Password validation: Must match password
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // Validation function for login form
  const validateLoginForm = () => {
    const errors = {};
    const { username, password } = loginFormData;

    // Email validation
    if (!username.trim()) {
      errors.username = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
      errors.username = 'Invalid email format';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSignupForm();
    setSignupFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Form is valid, proceed with signup API call
      console.log('Signup form submitted successfully:', signupFormData);
      
      try {
        // Call the backend signup API
        const response = await fetch('http://localhost:9090/api/v1/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: signupFormData.firstName,
            lastName: signupFormData.lastName,
            email: signupFormData.email,
            password: signupFormData.password,
            gender: signupFormData.gender,
            position: signupFormData.position,
            phoneNumber: signupFormData.phoneNumber
          })
        });

        const result = await response.json();

        if (response.ok) {
          // Signup successful
          console.log('Signup successful:', result);
          alert('Account created successfully! Please sign in with your credentials.');
          
          // Switch to login tab
          setActiveTab('login');
          
          // Clear signup form
          setSignupFormData({
            firstName: '',
            lastName: '',
            gender: '',
            position: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            countryCode: '',
          });
        } else {
          // Signup failed
          console.error('Signup failed:', result);
          const errorMessage = result.error || result.message || 'Signup failed. Please try again.';
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please check your connection and try again.');
      }
    } else {
      console.log('Signup form has errors:', errors);
    }
  };

  // Handler for login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLoginForm();
    setLoginFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Form is valid, proceed with API authentication
      console.log('Login form submitted successfully:', loginFormData);
      setIsLoggingIn(true);
      
      try {
        // Call the backend authentication API
        console.log('Attempting login with:', { email: loginFormData.username, password: '***' });
        
        const response = await fetch('http://localhost:9090/api/v1/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginFormData.username, // Use username as email
            password: loginFormData.password
          })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const result = await response.json();
        console.log('Response body:', result);

        if (response.ok) {
          // Login successful
          console.log('Login successful:', result);
          
          // Store authentication token and user data
          if (result.data && result.data.accessToken) {
            localStorage.setItem('token', result.data.accessToken);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
              email: loginFormData.username,
              id: result.data.id,
              firstName: result.data.firstName || '',
              lastName: result.data.lastName || ''
            }));
            
            console.log('Token stored successfully, navigating to:', from);
            // Navigate to the intended destination or dashboard
            navigate(from);
          } else {
            console.error('No access token in response:', result);
            throw new Error('No access token received from server');
          }
        } else {
          // Login failed
          console.error('Login failed:', result);
          const errorMessage = result.error || result.message || 'Login failed. Please check your credentials.';
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          alert('Connection failed. Please make sure the backend server is running on port 9090.');
        } else {
          alert(`Login failed: ${error.message}`);
        }
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      console.log('Login form has errors:', errors);
    }
  };

  return (
    <div className="signin-container">
      <div className="auth-card">
        <div className="auth-card-header">
          {activeTab === 'login' ? 'Login Form' : 'Signup Form'}
          {isRedirected && (
            <div className="redirect-message">
              Please sign in to access the dashboard
            </div>
          )}
        </div>
        <div className="auth-card-body">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabClick('login')}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabClick('signup')}
            >
              Signup
            </button>
          </div>

          {/* Conditionally render Login or Signup form */}
          {activeTab === 'login' ? (
            <div>
              <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  name="username"
                  value={loginFormData.username}
                  onChange={handleLoginInputChange}
                  className={loginFormErrors.username ? 'invalid-input' : ''}
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  name="password"
                  value={loginFormData.password}
                  onChange={handleLoginInputChange}
                  className={loginFormErrors.password ? 'invalid-input' : ''}
                />
              </div>
              <a href="/" className="forgot-password">Forgot password?</a>
              {/* Button container */}
              <div className="auth-button-group">
                <button type="submit" className="login-button" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in…' : 'Login'}
                </button>
                <button type="button" className="cancel-button">Cancel</button>
              </div>
            </form>
            </div>
          ) : (
            // Signup form
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="firstName" 
                  placeholder="First Name" 
                  value={signupFormData.firstName} 
                  onChange={handleSignupInputChange}
                  className={signupFormErrors.firstName ? 'invalid-input' : ''}
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="lastName" 
                  placeholder="Last Name" 
                  value={signupFormData.lastName} 
                  onChange={handleSignupInputChange}
                  className={signupFormErrors.lastName ? 'invalid-input' : ''}
                />
              </div>
              <div className="form-group">
                 <select 
                   name="gender" 
                   value={signupFormData.gender} 
                   onChange={handleSignupInputChange}
                   className={`form-input-style ${signupFormErrors.gender ? 'invalid-input' : ''}`}
                 >
                   <option value="">Select Gender</option>
                   <option value="male">Male</option>
                   <option value="female">Female</option>
                 </select>
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="position" 
                  placeholder="Position" 
                  value={signupFormData.position} 
                  onChange={handleSignupInputChange}
                  className={signupFormErrors.position ? 'invalid-input' : ''}
                />
              </div>
              <div className="form-group">
                {/* Phone Number Input with Country Code Select */}
                <div className="phone-input-container">
                  <select 
                    name="countryCode" 
                    value={signupFormData.countryCode} 
                    onChange={handleSignupInputChange}
                    className={`country-code-select ${signupFormErrors.countryCode ? 'invalid-input' : ''}`} // Apply error class
                  >
                    <option value="">Code</option>
                    <option value="+25">+25</option>
                    <option value="+39">+39</option>
                  </select>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    value={signupFormData.phoneNumber} 
                    onChange={handleSignupInputChange}
                    className={signupFormErrors.phoneNumber ? 'invalid-input' : ''} // Apply error class
                  />
                </div>
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={signupFormData.email} 
                  onChange={handleSignupInputChange}
                  className={signupFormErrors.email ? 'invalid-input' : ''}
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  value={signupFormData.password} 
                  onChange={handleSignupInputChange}
                  className={signupFormErrors.password ? 'invalid-input' : ''}
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm Password" 
                  value={signupFormData.confirmPassword} 
                  onChange={handleSignupInputChange}
                  className={signupFormErrors.confirmPassword ? 'invalid-input' : ''}
                />
              </div>
              {/* Button container */}
              <div className="auth-button-group">
                <button type="submit" className="signup-submit-button">Submit</button>
                <button type="button" className="cancel-button">Cancel</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Signin; 
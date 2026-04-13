import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './index.css';
import UsersServices from "../service/UsersServices";
import { setAuthToken } from "../../../utils/authSession";

const LoginAuth = () => {
    // State to handle form input values and error messages
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();  // Initialize useNavigate

    const validateForm = () => {
        const newErrors = {};

        // Validate email (basic email regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Validate password (must be alphanumeric and max 8 characters)
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;  // Alphanumeric, 6-8 characters
        if (!password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Password must be alphanumeric and between 6-8 characters";
        }

        setErrors(newErrors);

        // Return false if there are validation errors
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const data = await UsersServices.login(email, password);
                setAuthToken(data.token);
                navigate("/dashboard");
            } catch (error) {
                console.error("Login failed:", error);
                // Check for specific error status
                if (error.response && error.response.status === 401) {
                    setErrors({ 
                        ...errors, 
                        general: "Invalid email or password" 
                    });
                } else {
                    setErrors({ 
                        ...errors, 
                        general: "An unexpected error occurred. Please try again." 
                    });
                }
            }
        }
    };


    // Handle input change and remove error message
    const handleInputChange = (e, field) => {
        const { value } = e.target;

        if (field === "email") {
            setEmail(value);
            if (value) {
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.email;
                    return newErrors;
                });
            }
        } else if (field === "password") {
            setPassword(value);
            if (value) {
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.password;
                    return newErrors;
                });
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Log in..</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter your phone"
                            value={email}
                            onChange={(e) => handleInputChange(e, "email")}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => handleInputChange(e, "password")}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <div className="buttons-container">
                        <button type="submit" className="login-btn">Log in</button>
                        <a className="link-btn" href="/SignupForm">Create new account</a>
                    </div>
                </form>
                <div className="links">
                    <a href="/">Forgot password?</a>
                </div>
                <div className="social-login">
                    <p>Connect with us </p>
                    <button className="google-btn">Instagram</button>
                    <button className="facebook-btn">Facebook</button>
                    <button className="twitter-btn">Twitter</button>
                </div>
            </div>
        </div>
    );
};

export default LoginAuth;

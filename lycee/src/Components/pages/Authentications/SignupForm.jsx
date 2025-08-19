import React, { useState } from "react";
import { User, Mail, Phone, Globe, Briefcase, Lock } from "lucide-react";

const SignupForm = () => {
    // State to handle form input values and error messages
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        nationality: "",
        position: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);

    // Predefined position suggestions
    const positionSuggestions = ["Head Master", "Teacher"];

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Fullname validation
        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        } else if (formData.fullname.trim().length < 2) {
            newErrors.fullname = "Full name must be at least 2 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Phone validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters, contain letters and numbers";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Nationality validation
        if (!formData.nationality.trim()) {
            newErrors.nationality = "Nationality is required";
        }

        // Position validation
        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
        }

        setErrors(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Prepare data for backend submission
            const submissionData = {
                fullname: formData.fullname,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                nationality: formData.nationality,
                position: formData.position
            };

            console.log("Form submitted:", submissionData);
            // Here you would typically make an API call to your backend
            // axios.post('/api/signup', submissionData)
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Show suggestions for position input
        if (name === 'position') {
            setShowPositionSuggestions(true);
        }

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle position suggestion selection
    const handlePositionSelect = (suggestion) => {
        setFormData(prev => ({
            ...prev,
            position: suggestion
        }));
        setShowPositionSuggestions(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-black text-xl font-bold text-center mb-4">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Input */}
                    <div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.fullname ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.email ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone Input */}
                    <div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Nationality Input */}
                    <div>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="nationality"
                                placeholder="Nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.nationality ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                    </div>

                    {/* Position Input with Autocomplete */}
                    <div className="relative">
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="position"
                                placeholder="Position"
                                value={formData.position}
                                onChange={handleChange}
                                onFocus={() => setShowPositionSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowPositionSuggestions(false), 200)}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.position ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        
                        {/* Autocomplete Suggestions */}
                        {showPositionSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                {positionSuggestions
                                    .filter(suggestion => 
                                        suggestion.toLowerCase().includes(formData.position.toLowerCase())
                                    )
                                    .map((suggestion, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => handlePositionSelect(suggestion)}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                            {suggestion}
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none 
                                    ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                                    text-black text-sm font-normal`}
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="w-28 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 mr-2"
                        >
                            Sign Up
                        </button>
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?
                                <a href="/login" className="text-blue-500 ml-1 hover:underline">
                                    Log In
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
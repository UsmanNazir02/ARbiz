import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { authService } from '../services/authService';

const RegisterPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: 'user', // Default role
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific error when user starts typing again
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Name validations
        const nameRegex = /^[a-zA-Z\s]+[0-9\s]*$/;
        if (!nameRegex.test(formData.firstName)) {
            errors.firstName = "First name is not valid.";
        }

        if (!nameRegex.test(formData.lastName)) {
            errors.lastName = "Last name is not valid.";
        }

        // Username validation
        if (formData.username.length < 1 || formData.username.length > 20) {
            errors.username = "Username must be between 1 and 20 characters.";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        // Password validation
        if (formData.password.length < 8 || formData.password.length > 30) {
            errors.password = "Password must be between 8 and 30 characters.";
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Confirm password does not match with password.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await authService.register(formData);
            // Extract user and token from response based on your API structure
            const { user, accessToken } = response.data;
            onLogin(accessToken, user);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            <div className="flex min-h-screen">
                {/* Left side - Brand/Illustration */}
                <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between">
                    <div className="px-12 py-10">
                        <Link to="/" className="flex items-center">
                            <img className="h-12 w-auto" src="/src/assets/logo.svg" alt="ARbiz Logo" />
                            <span className="ml-3 text-2xl font-bold text-white">ARbiz</span>
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center px-12 py-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Join ARbiz Today</h2>
                        <p className="text-indigo-200 text-xl mb-8 text-center">
                            Create an account to start designing interactive AR business cards that leave a lasting impression.
                        </p>
                        <div className="w-3/4 h-64 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex items-end">
                                <div className="p-6">
                                    <p className="text-white font-medium text-lg mb-1">Ready to transform your networking?</p>
                                    <p className="text-indigo-200">Create dynamic AR business cards in minutes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-12 py-10">
                        <p className="text-indigo-200 text-sm">
                            © 2025 ARbiz. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Right side - Registration Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-lg">
                        <div className="lg:hidden mb-8 text-center">
                            <Link to="/" className="inline-block">
                                <img className="h-12 w-auto mx-auto" src="/src/assets/logo.svg" alt="ARbiz Logo" />
                                <span className="mt-2 block text-2xl font-bold text-indigo-600">ARbiz</span>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-xl px-8 py-10 mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter your first name"
                                            required
                                            className={`w-full px-3 py-2 border ${fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                        {fieldErrors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Enter your last name"
                                            required
                                            className={`w-full px-3 py-2 border ${fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        />
                                        {fieldErrors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Choose a username"
                                        required
                                        className={`w-full px-3 py-2 border ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {fieldErrors.username && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        required
                                        className={`w-full px-3 py-2 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {fieldErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password (8-30 characters)"
                                        required
                                        className={`w-full px-3 py-2 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {fieldErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required
                                        className={`w-full px-3 py-2 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    />
                                    {fieldErrors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            required
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                            I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
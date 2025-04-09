// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { authService } from '../services/authService';

const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            // Extract user and token from response based on your API structure
            const { user, accessToken } = response.data;
            onLogin(accessToken, user);
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
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
                        <h2 className="text-4xl font-bold text-white mb-6">Welcome Back!</h2>
                        <p className="text-indigo-200 text-xl mb-8 text-center">
                            Sign in to continue your journey with AR business cards and take your networking to the next level.
                        </p>
                        <div className="w-3/4 bg-indigo-500/20 rounded-xl p-8 backdrop-blur-sm">
                            <blockquote className="text-white italic">
                                "ARbiz has transformed my networking experience. The interactive cards make a lasting impression!"
                            </blockquote>
                            <div className="mt-4 flex items-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-700 font-bold">
                                    ET
                                </div>
                                <div className="ml-3">
                                    <p className="text-white font-medium">Emily Thompson</p>
                                    <p className="text-indigo-200 text-sm">Marketing Director</p>
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

                {/* Right side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden mb-8 text-center">
                            <Link to="/" className="inline-block">
                                <img className="h-12 w-auto mx-auto" src="/src/assets/logo.svg" alt="ARbiz Logo" />
                                <span className="mt-2 block text-2xl font-bold text-indigo-600">ARbiz</span>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-xl px-8 py-10 mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

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
                                <Input
                                    label="Email"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    required
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

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
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account yet?{' '}
                                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
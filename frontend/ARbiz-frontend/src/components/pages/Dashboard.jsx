import { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../common/Navbar';

const DashboardPage = ({ onLogout }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'User' };
    });

    const handleLogout = async () => {
        try {
            await authService.logout();
            onLogout();
        } catch (error) {
            console.error('Logout failed:', error);
            onLogout();
        }
    };

    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            <Navbar user={user} handleLogout={handleLogout} />

            {/* Dashboard Content */}
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-500 to-indigo-600">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h2>
                                    <p className="mt-1 text-indigo-100">Here's what's happening with your AR cards today.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/card/new')}
                                    className="mt-4 md:mt-0 px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                >

                                    Create New Card
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Stat Card 1 */}
                        <div className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-indigo-500">
                            <div className="px-5 py-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total AR Cards
                                            </dt>
                                            <dd>
                                                <div className="flex items-baseline">
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        12
                                                    </p>
                                                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                                        <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="sr-only">Increased by</span>
                                                        3.2%
                                                    </p>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-blue-500">
                            <div className="px-5 py-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Card Views
                                            </dt>
                                            <dd>
                                                <div className="flex items-baseline">
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        248
                                                    </p>
                                                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                                        <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="sr-only">Increased by</span>
                                                        12.4%
                                                    </p>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-green-500">
                            <div className="px-5 py-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Conversions
                                            </dt>
                                            <dd>
                                                <div className="flex items-baseline">
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        24%
                                                    </p>
                                                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                                        <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="sr-only">Increased by</span>
                                                        4.6%
                                                    </p>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="bg-white overflow-hidden shadow rounded-xl border-l-4 border-purple-500">
                            <div className="px-5 py-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Avg. Time Viewed
                                            </dt>
                                            <dd>
                                                <div className="flex items-baseline">
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        42s
                                                    </p>
                                                    <p className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                                        <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="sr-only">Decreased by</span>
                                                        2.8%
                                                    </p>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                                        View all
                                    </button>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    <li className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                                                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    New AR Card Created
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    Business Card - Tech Company
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Today at 2:30 PM
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    Card Shared
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    Personal Card - Creative Design
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Yesterday at 9:15 AM
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    Card Viewed
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    Corporate Card - Financial Services
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    New
                                                </span>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    2 days ago
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <div className="bg-white shadow rounded-xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                                                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">Create New Card</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
                                                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">Import Contacts</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-md">
                                                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">Upgrade Plan</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-purple-100 p-2 rounded-md">
                                                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">Settings</span>
                                        </div>
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Cards */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Your AR Cards</h2>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                                View all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Card 1 */}
                            <div className="bg-white overflow-hidden shadow rounded-xl group hover:shadow-lg transition-shadow">
                                <div className="p-5">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">Tech Innovations</h3>
                                            <p className="mt-1 text-sm text-gray-500">Business Card</p>
                                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                Last updated 3 days ago
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 group-hover:underline">
                                            View details
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white overflow-hidden shadow rounded-xl group hover:shadow-lg transition-shadow">
                                <div className="p-5">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">Creative Design</h3>
                                            <p className="mt-1 text-sm text-gray-500">Personal Card</p>
                                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                Last updated 1 week ago
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 group-hover:underline">
                                            View details
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Add New Card */}
                            <div className="relative bg-white overflow-hidden shadow rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-colors group">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-0 bg-indigo-50 bg-opacity-50"></div>
                                </div>
                                <button
                                    type="button"
                                    className="relative block w-full h-full p-12 text-center focus:outline-none"
                                >
                                    <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="mt-2 block text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                                        Create new AR Card
                                    </span>
                                    <span className="mt-1 block text-xs text-gray-500 group-hover:text-indigo-600 transition-colors">
                                        Get started with a new card
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
import { Link, useNavigate } from 'react-router-dom';

export function Navbar({ user, handleLogout }) {
    const navigate = useNavigate();

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <img className="h-10 w-auto" src="/src/assets/logo.svg" alt="ARbiz Logo" />
                        <h1 className="ml-3 text-2xl font-bold text-white">ARbiz</h1>
                    </div>
                    <nav className="hidden md:flex space-x-1">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:text-white hover:bg-indigo-700 transition-colors"
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => navigate('/my-cards')}
                            className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:text-white hover:bg-indigo-700 transition-colors"
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => navigate('/analytics')}
                            className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:text-white hover:bg-indigo-700 transition-colors"
                        >
                            Analytics
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:text-white hover:bg-indigo-700 transition-colors"
                        >
                            Settings
                        </button>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                            <span className="sr-only">View notifications</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-400 ring-2 ring-indigo-600"></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center text-white font-medium">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-indigo-100 font-medium">{user?.name || 'User'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}

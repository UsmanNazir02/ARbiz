
import { Link } from 'react-router-dom';

export function Navbar({ isAuthenticated, onLogout }) {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img className="h-8 w-auto" src="/src/assets/logo.svg" alt="ARbiz Logo" />
                            <span className="ml-2 text-xl font-bold text-gray-900">ARbiz</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <button
                                onClick={onLogout}
                                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
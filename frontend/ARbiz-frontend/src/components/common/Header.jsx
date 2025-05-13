import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    return (
        <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img className="h-10 w-auto" src="/src/assets/logo.svg" alt="Logo" />
                    <h1 className="ml-3 text-2xl font-bold text-white">ARbiz</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-white">{user?.name}</span>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

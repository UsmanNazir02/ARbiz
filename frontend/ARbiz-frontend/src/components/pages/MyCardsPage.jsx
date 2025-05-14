import { useEffect, useState } from 'react';
import { cardService } from '../services/cardService';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { SparklesIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

const MyCardsPage = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'User' };
    });

    const handleLogout = async () => {
        try {
            localStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        const fetchMyCards = async () => {
            try {
                const { data } = await cardService.getUserCards();
                setCards(data);
            } catch (error) {
                console.error('Failed to fetch cards', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCards();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-indigo-600 text-xl animate-pulse">
                Loading your AR cards...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
            <Navbar user={user} handleLogout={handleLogout} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold text-indigo-800 flex items-center gap-3">
                        <SparklesIcon className="h-7 w-7 text-indigo-500 animate-pulse" />
                        My AR Cards
                    </h2>
                    <button
                        onClick={() => navigate('/card/new')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transition-all"
                    >
                        + Create New Card
                    </button>
                </div>

                {cards.length === 0 ? (
                    <div className="text-center mt-24">
                        <img
                            src="/src/assets/empty-illustration.svg"
                            alt="No Cards"
                            className="mx-auto w-72 opacity-80 mb-6"
                        />
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Cards Available</h3>
                        <p className="text-gray-500 mb-5">It looks like you haven’t created any AR cards yet.</p>
                        <button
                            onClick={() => navigate('/card/new')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                        >
                            Create Your First Card
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cards.map(card => (
                            <div
                                key={card._id}
                                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-[1.02] duration-300 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-10 rounded-2xl pointer-events-none" />

                                <div className="relative z-10 space-y-1 mb-4">
                                    <h3 className="text-xl font-bold text-indigo-800">{card.cardTitle}</h3>
                                    <p className="text-gray-800 font-medium">{card.fullName}</p>
                                    <p className="text-gray-500 text-sm">{card.companyName}</p>
                                </div>

                                <div className="relative z-10 space-y-1 text-sm text-gray-700">
                                    <p>📧 <span className="font-medium">{card.email}</span></p>
                                    <p>📞 <span className="font-medium">{card.phone}</span></p>
                                </div>

                                <div className="relative z-10 mt-5 flex justify-between items-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${card.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {card.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    <button
                                        onClick={() => navigate(`/card/edit/${card._id}`)}
                                        className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline"
                                    >
                                        <PencilSquareIcon className="h-4 w-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCardsPage;

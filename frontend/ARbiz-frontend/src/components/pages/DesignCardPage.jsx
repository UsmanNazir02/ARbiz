import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cardService } from '../services/cardService';
import axios from 'axios';
import { Navbar } from '../common/Navbar';
import {
    CreditCard,
    User,
    ChevronDown,
    X,
    Upload,
    Phone,
    Mail,
    Globe,
    MapPin,
    Check,
    Eye,
    Settings
} from 'lucide-react';

const DesignCardPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        cardTitle: '',
        fullName: '',
        designation: '',
        companyName: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        themeColor: '#6366f1', // Updated default to match indigo theme
        fontStyle: 'Poppins',
        logo: '',
        backgroundImage: '',
        isPublished: false,
    });

    const [logoFile, setLogoFile] = useState(null);
    const [bgFile, setBgFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [bgPreview, setBgPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { name: 'User' };
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            cardService.getCardById(id)
                .then(({ data }) => {
                    setFormData(data);
                    if (data.logo) setLogoPreview(data.logo);
                    if (data.backgroundImage) setBgPreview(data.backgroundImage);
                })
                .catch(err => {
                    setMessage({ type: 'error', text: 'Failed to load card data' });
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpload = async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`/upload/${type}`, formData);
            return response.data.url;
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            setMessage({ type: 'error', text: `Failed to upload ${type}` });
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const updatedFormData = { ...formData };

            if (logoFile) {
                updatedFormData.logo = await handleUpload(logoFile, 'logo');
            }

            if (bgFile) {
                updatedFormData.backgroundImage = await handleUpload(bgFile, 'background');
            }

            if (id) {
                await cardService.updateCard(id, updatedFormData);
                setMessage({ type: 'success', text: 'Card updated successfully!' });
            } else {
                await cardService.createCard(updatedFormData);
                setMessage({ type: 'success', text: 'Card created successfully!' });
            }

            // Redirect after a short delay so the user can see the success message
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save card. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const previewCardStyle = {
        backgroundImage: bgPreview ? `url(${bgPreview})` : formData.backgroundImage ? `url(${formData.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundColor: formData.themeColor,
        fontFamily: formData.fontStyle,
        color: getContrastColor(formData.themeColor),
        transition: 'all 0.3s ease'
    };

    // Function to determine text color based on background for optimal contrast
    function getContrastColor(hexColor) {
        // Remove the # if present
        hexColor = hexColor.replace('#', '');

        // Convert to RGB
        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);

        // Calculate luminance - https://www.w3.org/TR/WCAG20-TECHS/G17.html
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return black for bright colors, white for dark colors
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    if (loading && !id) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Using the custom Navbar component */}
            <Navbar user={user} handleLogout={handleLogout} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            {id ? 'Customize Your Business Card' : 'Create New Business Card'}
                        </h1>
                        <p className="mt-2 text-md text-gray-600">
                            Design your professional digital card with augmented reality features
                        </p>
                    </div>
                    <div>
                        <a
                            href="/dashboard"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'} flex items-center`}>
                        {message.type === 'error' ?
                            <X className="h-5 w-5 mr-2" /> :
                            <Check className="h-5 w-5 mr-2" />
                        }
                        {message.text}
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                        {/* Form Section - takes 3/5 of the space */}
                        <div className="lg:col-span-3 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="bg-indigo-50 p-5 rounded-lg mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                                        Card Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="cardTitle" className="block text-sm font-medium text-gray-700">Card Title</label>
                                            <input
                                                id="cardTitle"
                                                name="cardTitle"
                                                value={formData.cardTitle}
                                                onChange={handleChange}
                                                placeholder="My Professional Card"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                                            <input
                                                id="designation"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                placeholder="Senior Developer"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                                            <input
                                                id="companyName"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                placeholder="Acme Inc."
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-5 rounded-lg mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-indigo-600" />
                                        Contact Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center">
                                                <Phone className="h-4 w-4 mr-1 text-gray-500" />
                                                Phone
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+1 234 567 8900"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                                                <Mail className="h-4 w-4 mr-1 text-gray-500" />
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 flex items-center">
                                                <Globe className="h-4 w-4 mr-1 text-gray-500" />
                                                Website
                                            </label>
                                            <input
                                                id="website"
                                                name="website"
                                                type="url"
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="https://example.com"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 flex items-center">
                                                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                                Address
                                            </label>
                                            <input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="123 Business St, City"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-5 rounded-lg mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                                        Card Appearance
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                                            <div className="flex items-center">
                                                <input
                                                    id="themeColor"
                                                    name="themeColor"
                                                    type="color"
                                                    value={formData.themeColor}
                                                    onChange={handleChange}
                                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                                />
                                                <span className="ml-2 text-sm text-gray-500 uppercase">{formData.themeColor}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="fontStyle" className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
                                            <select
                                                id="fontStyle"
                                                name="fontStyle"
                                                value={formData.fontStyle}
                                                onChange={handleChange}
                                                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="Arial">Arial</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Poppins">Poppins</option>
                                                <option value="Montserrat">Montserrat</option>
                                                <option value="Open Sans">Open Sans</option>
                                                <option value="Playfair Display">Playfair Display</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                                            <div className="flex items-center">
                                                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center">
                                                    <Upload className="h-4 w-4 mr-1" />
                                                    <span>Upload Logo</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setLogoFile(file);
                                                                setLogoPreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                {(logoPreview || formData.logo) && (
                                                    <div className="ml-4 relative w-16 h-16 flex-shrink-0">
                                                        <img
                                                            src={logoPreview || formData.logo}
                                                            alt="Logo preview"
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setLogoFile(null);
                                                                setLogoPreview('');
                                                                setFormData(prev => ({ ...prev, logo: '' }));
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                                            <div className="flex items-center">
                                                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center">
                                                    <Upload className="h-4 w-4 mr-1" />
                                                    <span>Upload Background</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setBgFile(file);
                                                                setBgPreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                {(bgPreview || formData.backgroundImage) && (
                                                    <div className="ml-4 relative w-16 h-16 flex-shrink-0">
                                                        <img
                                                            src={bgPreview || formData.backgroundImage}
                                                            alt="Background preview"
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setBgFile(null);
                                                                setBgPreview('');
                                                                setFormData(prev => ({ ...prev, backgroundImage: '' }));
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                                    <input
                                        id="isPublished"
                                        name="isPublished"
                                        type="checkbox"
                                        checked={formData.isPublished}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 flex items-center">
                                        <Eye className="h-4 w-4 mr-1 text-gray-500" />
                                        Publish card (make it visible to others)
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`inline-flex items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {id ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                {id ? 'Update Card' : 'Create Card'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Section - takes 2/5 of the space */}
                        <div className="lg:col-span-2 bg-gray-50 p-8 border-l border-gray-200 flex flex-col">
                            <div className="sticky top-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center">
                                    <Eye className="h-5 w-5 mr-2 text-indigo-600" />
                                    Live Card Preview
                                </h3>

                                <div className="mx-auto w-full max-w-md">
                                    {/* Card Preview */}
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl mb-8">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none"></div>

                                        <div
                                            className="relative p-8 h-full flex flex-col justify-between overflow-hidden"
                                            style={previewCardStyle}
                                        >
                                            <div>
                                                {(logoPreview || formData.logo) && (
                                                    <img
                                                        src={logoPreview || formData.logo}
                                                        alt="Company Logo"
                                                        className="w-20 h-20 object-contain mb-6"
                                                    />
                                                )}

                                                <h2 className="text-2xl font-bold mt-2">{formData.fullName || 'Your Name'}</h2>
                                                {formData.designation && <p className="text-lg opacity-90">{formData.designation}</p>}
                                                {formData.companyName && <p className="text-lg font-semibold mt-1">{formData.companyName}</p>}
                                            </div>

                                            <div className="mt-6 space-y-2">
                                                {formData.phone && (
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        <span>{formData.phone}</span>
                                                    </div>
                                                )}

                                                {formData.email && (
                                                    <div className="flex items-center">
                                                        <Mail className="h-4 w-4 mr-2" />
                                                        <span>{formData.email}</span>
                                                    </div>
                                                )}

                                                {formData.website && (
                                                    <div className="flex items-center">
                                                        <Globe className="h-4 w-4 mr-2" />
                                                        <span>{formData.website}</span>
                                                    </div>
                                                )}

                                                {formData.address && (
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        <span>{formData.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                                            <p className="text-sm text-gray-600 mb-3 text-center">
                                                Scan this card with our AR app to see it in augmented reality
                                            </p>
                                            <div className="bg-gray-100 p-4 rounded-md flex justify-center">
                                                <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                                    QR Code Placeholder
                                                </div>
                                            </div>
                                            <div className="flex justify-center mt-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${formData.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {formData.isPublished ? (
                                                        <>
                                                            <Check className="h-3 w-3 mr-1" />
                                                            Published
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-3 w-3 mr-1" />
                                                            Not Published
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignCardPage;
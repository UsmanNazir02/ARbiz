import axios from 'axios';

// You can adjust the base URL as needed
const API_URL = 'http://localhost:3020/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Authentication service
export const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            console.log('Response:', response.data); // Debugging line
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout user
    logout: async (fcmToken = null) => {
        try {
            const response = await axiosInstance.post('/auth/logout', { fcmToken });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default axiosInstance;
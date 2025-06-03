import axiosInstance from './authService'; // Reuse the same axios instance

export const cardService = {
    // Create a new card
    createCard: async (data) => {
        try {
            const response = await axiosInstance.post('/card', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Fetch all user cards
    getUserCards: async () => {
        try {
            const response = await axiosInstance.get('/card');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get a single card by ID
    getCardById: async (id) => {
        try {
            const response = await axiosInstance.get(`/card/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update a card
    updateCard: async (id, data) => {
        try {
            const response = await axiosInstance.put(`/card/update/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete a card
    deleteCard: async (id) => {
        try {
            const response = await axiosInstance.delete(`/card/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCardByPublicId: async (cardId) => {
        try {
            const response = await axiosInstance.get(`/card/public/${cardId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

};

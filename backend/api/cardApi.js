const { fetchUserCards, getCardById, createCard, updateCard, deleteCard } = require('../controllers/cardController');
const { ROLES } = require('../utils/constants');
const authMiddleware = require('../middlewares/auth');

const router = require('express').Router();

class CardAPI {
    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.get('/', authMiddleware(Object.values(ROLES)), fetchUserCards);
        router.get('/:id', authMiddleware(Object.values(ROLES)), getCardById);

        router.post('/', authMiddleware(Object.values(ROLES)), createCard);

        router.put('/update/:id', authMiddleware(Object.values(ROLES)), updateCard);

        router.delete('/delete/:id', authMiddleware(Object.values(ROLES)), deleteCard);
    }
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/card';
    }
}

module.exports = CardAPI;
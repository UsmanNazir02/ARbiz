const { fetchUserCards, getCardById, createCard, updateCard, deleteCard, getCardQR, updateCardScanCount, getCardByPublicId, deleteCardImage } = require('../controllers/cardController');
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
        router.get('/qr/:id', authMiddleware(Object.values(ROLES)), getCardQR);
        router.get('/public/:cardId', getCardByPublicId);

        router.post('/', authMiddleware(Object.values(ROLES)), createCard);

        router.put('/viewer/:cardId', updateCardScanCount);
        router.put('/update/:id', authMiddleware(Object.values(ROLES)), updateCard);

        router.delete('/delete/:id', authMiddleware(Object.values(ROLES)), deleteCard);
        router.delete('/image/:id', authMiddleware(Object.values(ROLES)), deleteCardImage);

    }
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/card';
    }
}

module.exports = CardAPI;
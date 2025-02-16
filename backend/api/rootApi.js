const router = require('express').Router();
const { DefaultHandler } = require('../controllers/rootController');

class RootAPI {
    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.get('/', DefaultHandler);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/';
    }
}

module.exports = RootAPI;

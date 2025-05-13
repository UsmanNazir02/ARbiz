const { addCard, findAndDeleteCard, findAndUpdateCard, findCard, findCards } = require('../models/cardModel');
const { generateResponse, asyncHandler } = require('../utils');


exports.createCard = asyncHandler(async (req, res, next) => {
    const {
        cardTitle,
        fullName,
        designation,
        companyName,
        phone,
        email,
        website,
        address,
        themeColor,
        fontStyle,
        logo,
        backgroundImage,
        cardImage,
        isPublished,
    } = req.body;

    const card = await addCard({
        user: req.user._id,
        cardTitle,
        fullName,
        designation,
        companyName,
        phone,
        email,
        website,
        address,
        themeColor,
        fontStyle,
        logo,
        backgroundImage,
        cardImage,
        isPublished,
    });

    generateResponse(card, "Card created successfully", res);
});


exports.updateCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const card = await findAndUpdateCard(
        { _id: id, user: req.user._id, isPublished: false }, // prevent updates if published
        { $set: req.body },
        { new: true }
    );

    if (!card) {
        return next({ statusCode: 404, message: "Card not found or already published" });
    }

    generateResponse(card, "Card updated successfully", res);
});

exports.fetchUserCards = asyncHandler(async (req, res, next) => {
    const cards = await findCards({ user: req.user._id });
    generateResponse(cards, "Cards fetched successfully", res);
});

exports.getCardById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const card = await findCard({ _id: id, user: req.user._id });
    if (!card) return next({ statusCode: 404, message: "Card not found" });

    generateResponse(card, "Card fetched successfully", res);
});

exports.deleteCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const card = await findAndDeleteCard({ _id: id, user: req.user._id });
    if (!card) return next({ statusCode: 404, message: "Card not found" });

    generateResponse(null, "Card deleted successfully", res);
});
const { addCard, findAndDeleteCard, findAndUpdateCard, findCard, findCards } = require('../models/cardModel');
const { generateResponse, asyncHandler, createPublicId, createQr } = require('../utils');

exports.createCard = asyncHandler(async (req, res) => {
    const payload = req.body;

    // 1) generate public id & viewer URL
    const cardId = createPublicId();
    const viewerUrl = `${process.env.PUBLIC_URL}/viewer/${cardId}`;

    // 2) generate QR
    const qrCodePng = await createQr(viewerUrl);

    // 3) save
    const card = await addCard({
        ...payload,
        cardId,
        viewerUrl,
        qrCode: qrCodePng,
        arEnabled: true
    });

    generateResponse(card, 'Card created', res);
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

exports.getCardQR = asyncHandler(async (req, res, next) => {
    const card = await Card.findById(req.params.id).select('qrCode');
    if (!card) return res.status(404).send('Not found');

    generateResponse(card.qrCode, "QR Code fetched successfully", res);
});

exports.updateCardScanCount = asyncHandler(async (req, res, next) => {
    const { cardId } = req.params;

    const card = await findAndUpdateCard(
        { cardId },
        { $inc: { scanCount: 1 } },
        { new: true }
    );

    if (!card) return next({ statusCode: 404, message: "Card not found" });

    // No response needed - just redirect to client
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


exports.getARCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const card = await findCard({ _id: id });
    if (!card) return next({ statusCode: 404, message: "Card not found" });

    generateResponse({
        textureUrl: card.cardImage ?? card.logo,
        glbUrl: card.glbUrl ?? null,
        fullName: card.fullName,
        themeColor: card.themeColor
    }, "AR Card details fetched successfully", res);
});

exports.getCardByPublicId = asyncHandler(async (req, res, next) => {
    const { cardId } = req.params;

    const card = await findCard({
        cardId: cardId,
        isPublished: true
    });

    if (!card) {
        return next({ statusCode: 404, message: "Card not found or not published" });
    }

    const cardData = {
        cardId: card.cardId,
        cardTitle: card.cardTitle,
        fullName: card.fullName,
        designation: card.designation,
        companyName: card.companyName,
        phone: card.phone,
        email: card.email,
        website: card.website,
        address: card.address,
        themeColor: card.themeColor,
        fontStyle: card.fontStyle,
        logo: card.logo,
        backgroundImage: card.backgroundImage,
        cardImage: card.cardImage,
        qrCode: card.qrCode,
        viewerUrl: card.viewerUrl,
        arEnabled: card.arEnabled,
        glbUrl: card.glbUrl,
        // For AR compatibility, provide textureUrl as fallback
        textureUrl: card.cardImage || card.logo || null
    };
    console.log("Card Data:", cardData);
    generateResponse(cardData, "Card fetched successfully", res);
});

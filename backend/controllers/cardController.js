const { deleteCloudinaryImage } = require('../config/cloudinary');
const { getFileUrl, uploadCardImages, handleMulterError, deleteFile } = require('../config/multer');
const { addCard, findAndDeleteCard, findAndUpdateCard, findCard, findCards } = require('../models/cardModel');
const { generateResponse, asyncHandler, createPublicId, createQr } = require('../utils');


const getFilenameFromUrl = (url) => {
    if (!url) return null;
    return path.basename(url);
};

// Helper function to get file path from URL
const getFilePathFromUrl = (url, type) => {
    if (!url) return null;
    const filename = getFilenameFromUrl(url);
    return `uploads/${type}s/${filename}`;
};

exports.createCard = asyncHandler(async (req, res) => {
    uploadCardImages(req, res, async (err) => {
        if (err) {
            return handleMulterError(err, req, res, () => { });
        }

        const payload = { ...req.body };

        // Process uploaded files - Cloudinary URLs are directly available
        if (req.files) {
            if (req.files.logo) {
                payload.logo = req.files.logo[0].path; // Cloudinary URL
            }

            if (req.files.background) {
                payload.backgroundImage = req.files.background[0].path; // Cloudinary URL
            }
        }

        // Generate public id & viewer URL
        const cardId = createPublicId();
        const viewerUrl = `${process.env.PUBLIC_URL}/viewer/${cardId}`;

        // Generate QR
        const qrCodePng = await createQr(viewerUrl);

        // Save card
        const card = await addCard({
            ...payload,
            cardId,
            viewerUrl,
            qrCode: qrCodePng,
            arEnabled: true,
            user: req.user.id,
        });

        generateResponse(card, 'Card created successfully', res);
    });
});

exports.updateCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Handle file uploads first
    uploadCardImages(req, res, async (err) => {
        if (err) {
            return handleMulterError(err, req, res, () => { });
        }

        // Get existing card to check for old files
        const existingCard = await findCard({ _id: id, user: req.user.id });

        if (!existingCard) {
            // Clean up uploaded files if card doesn't exist
            if (req.files) {
                if (req.files.logo) {
                    await deleteCloudinaryImage(req.files.logo[0].path);
                }
                if (req.files.background) {
                    await deleteCloudinaryImage(req.files.background[0].path);
                }
            }
            return next({ statusCode: 404, message: "Card not found" });
        }

        if (existingCard.isPublished) {
            // Clean up uploaded files if card is already published
            if (req.files) {
                if (req.files.logo) {
                    await deleteCloudinaryImage(req.files.logo[0].path);
                }
                if (req.files.background) {
                    await deleteCloudinaryImage(req.files.background[0].path);
                }
            }
            return next({ statusCode: 400, message: "Cannot update published card" });
        }

        const updatePayload = { ...req.body };

        // Process uploaded files and handle old file cleanup
        if (req.files) {
            if (req.files.logo) {
                updatePayload.logo = req.files.logo[0].path; // Cloudinary URL

                // Delete old logo from Cloudinary if it exists
                if (existingCard.logo) {
                    await deleteCloudinaryImage(existingCard.logo);
                }
            }

            if (req.files.background) {
                updatePayload.backgroundImage = req.files.background[0].path; // Cloudinary URL

                // Delete old background from Cloudinary if it exists
                if (existingCard.backgroundImage) {
                    await deleteCloudinaryImage(existingCard.backgroundImage);
                }
            }
        }

        // Update card
        const card = await findAndUpdateCard(
            { _id: id, user: req.user.id },
            { $set: updatePayload },
            { new: true }
        );

        generateResponse(card, "Card updated successfully", res);
    });
});

exports.fetchUserCards = asyncHandler(async (req, res, next) => {
    const cards = await findCards({ user: req.user.id });
    if (!cards || cards.length === 0) return next({ statusCode: 404, message: "No cards found for this user" });

    generateResponse(cards, "Cards fetched successfully", res);
});

exports.getCardById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const card = await findCard({ _id: id, user: req.user.id });
    if (!card) return next({ statusCode: 404, message: "Card not found" });

    generateResponse(card, "Card fetched successfully", res);
});

exports.deleteCard = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const card = await findAndDeleteCard({ _id: id, user: req.user.id });
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
    generateResponse(null, "Card scan count updated successfully", res, 204);
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

exports.deleteCardImage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { imageType } = req.body; // 'logo' or 'background'

    const existingCard = await findCard({ _id: id, user: req.user.id });

    if (!existingCard) {
        return next({ statusCode: 404, message: "Card not found" });
    }

    if (existingCard.isPublished) {
        return next({ statusCode: 400, message: "Cannot update published card" });
    }

    let updatePayload = {};

    if (imageType === 'logo' && existingCard.logo) {
        await deleteCloudinaryImage(existingCard.logo);
        updatePayload.logo = null;
    } else if (imageType === 'background' && existingCard.backgroundImage) {
        await deleteCloudinaryImage(existingCard.backgroundImage);
        updatePayload.backgroundImage = null;
    }

    const card = await findAndUpdateCard(
        { _id: id, user: req.user.id },
        { $unset: updatePayload },
        { new: true }
    );

    generateResponse(card, `${imageType} deleted successfully`, res);
});
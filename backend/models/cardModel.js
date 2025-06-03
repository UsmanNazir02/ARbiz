const { Schema, model, Types } = require('mongoose');

const cardSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User" },

    // Editable fields
    cardTitle: { type: String, default: "" }, // e.g., "My Business Card"
    fullName: { type: String, default: "" },
    designation: { type: String, default: "" },
    companyName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    address: { type: String, default: "" },

    // Design settings
    themeColor: { type: String, default: "#ffffff" },
    fontStyle: { type: String, default: "Arial" },
    logo: { type: String, default: null }, // URL to logo image
    backgroundImage: { type: String, default: null }, // optional background

    // Final rendered card (image URL)
    cardImage: { type: String, default: null }, // final exported image of the designed card

    // Whether the card is published or still being designed
    isPublished: { type: Boolean, default: false },

    qrCode: { type: String },        // data-URI PNG
    arEnabled: { type: Boolean, default: true },
    viewerUrl: { type: String },
    cardId: { type: String, unique: true },   // slender public id
    glbUrl: { type: String },        // optional – if you pre-bake a 3-D model
    // analytics
    scanCount: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false, });

const CardModel = model("Card", cardSchema);

exports.addCard = (obj) => CardModel.create(obj);

exports.findAndUpdateCard = (query, obj) => CardModel.findOneAndUpdate(query, obj, { new: true });

exports.findCards = (query) => CardModel.find(query);

exports.findCard = (query) => CardModel.findOne(query);

exports.findAndDeleteCard = (query) => CardModel.findOneAndDelete(query);
const { Schema, model } = require('mongoose');
const { ROLES } = require('../utils/constants');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

// user schema
const userSchema = new Schema({
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, default: "" },
    email: { type: String, lowercase: true, default: null },
    profileImage: { type: String },
    password: { type: String, select: false, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    role: { type: String, default: ROLES.USER, enum: Object.values(ROLES) },
    accessToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
}, { timestamps: true, versionKey: false });

// pagination plugins
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

// compile model from schema
const UserModel = model('User', userSchema);

// create new user
exports.createUser = (obj) => UserModel.create(obj);

// find user by query
exports.findUser = (query) => UserModel.findOne({ ...query, isDeleted: false });

// update user
exports.updateUser = (query, obj) => UserModel.findOneAndUpdate(query, obj, { new: true });

// get all users (pagination)
exports.getAllUsers = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongooseAggregatePaginatedData({
        model: UserModel,
        query,
        page,
        limit,
    });

    return { users: data, pagination };
};

exports.findAndUpdateUser = (query, obj) => UserModel.findOneAndUpdate(query, obj, { new: true });
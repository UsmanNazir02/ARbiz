const { hash, compare } = require("bcrypt");
const { findUser, createUser, updateUser } = require("../models/userModel");
const { parseBody, asyncHandler, generateToken, generateRefreshToken, generateResponse } = require("../utils");
const { registerUserValidation, loginUserValidation } = require("../validations/authValidation");
const { STATUS_CODES } = require("../utils/constants");

exports.register = asyncHandler(async (req, res, next) => {
    const body = parseBody(req.body);

    // Joi validation
    const { error } = registerUserValidation.validate(body);
    if (error) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: error.details[0].message
    });

    const userWithEmail = await findUser({ email: body.email });

    if (userWithEmail) return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: 'Email already exists'
    });

    // hash password
    const hashedPassword = await hash(body.password, 10);
    body.password = hashedPassword;

    // create user in db
    let user = await createUser(body);

    // generate access token and refresh token
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    req.session.accessToken = accessToken;

    // update user with refreshToken
    user = await updateUser({ _id: user._id }, { $set: { refreshToken, accessToken } });
    generateResponse({ user, accessToken, refreshToken }, 'Register successful', res);
});

exports.login = asyncHandler(async (req, res, next) => {
    const body = parseBody(req.body);

    // Joi validation
    const { error } = loginUserValidation.validate(body)
    if (error) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: error.details[0].message
    });

    // let user = await findUser({ email: body?.email, role: { $ne: ROLES.ADMIN } }).select('+password');
    let user = await findUser({ email: body?.email }).select('+password');
    if (!user) return next({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: 'Email not found'
    });

    // checking password match
    const isMatch = await compare(body.password, user.password);
    if (!isMatch) return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: 'Invalid password'
    });

    // check if user is active
    if (!user.isActive) return next({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: 'Your account is inactive, please contact admin'
    });

    const accessToken = generateToken(user)
    const refreshToken = generateRefreshToken(user)

    req.session.accessToken = accessToken;

    // update user fcmToken
    user = await updateUser(
        { _id: user._id },
        {
            $addToSet: { fcmTokens: body.fcmToken },
            $set: { refreshToken }
        }
    );
    generateResponse({ user, accessToken, refreshToken }, 'Login Successful', res);
});

// logout user
exports.logout = asyncHandler(async (req, res, next) => {
    const fcmToken = req.body.fcmToken;
    await updateUser(
        { _id: req.user.id },
        { $pull: { fcmTokens: fcmToken } }
    );
    req.session = null;
    generateResponse(null, 'Logout successful', res);
});
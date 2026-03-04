const asyncHandler = require('../middleware/asyncHandler');
const userService = require('../services/userService');
const sendResponse = require('../utils/sendResponse');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await userService.registerUser({ name, email, password, role });

    const token = userService.generateAccessToken(user._id, user.role);

    return sendResponse(res, 201, { token, data: user }, 'User registered successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userService.loginUser(email, password);

    const token = userService.generateAccessToken(user._id, user.role);

    return sendResponse(res, 200, { token, data: user }, 'Login successful');
});

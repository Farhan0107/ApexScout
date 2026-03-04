const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    return user;
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
const loginUser = async (email, password) => {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    return user;
};

/**
 * Generate Access Token
 * @param {string} id 
 * @param {string} role 
 * @returns {string}
 */
const generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h',
    });
};

module.exports = {
    registerUser,
    loginUser,
    generateAccessToken,
};

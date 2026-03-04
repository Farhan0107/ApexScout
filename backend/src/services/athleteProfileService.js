const AthleteProfile = require('../models/AthleteProfile');
const User = require('../models/User');

/**
 * Normalization Helper
 * Converts raw metrics to a standardized scale (0-100).
 * @param {Object} rawMetrics 
 * @returns {Object}
 */
const normalizeMetrics = (rawMetrics) => {
    // Standard limits defined in AthleteProfile schema
    const limits = {
        speed: 100,
        verticalLeap: 60,
        wingspan: 120,
        pointsPerGame: 150,
        assists: 50,
        stamina: 100
    };

    const normalized = {};
    Object.keys(rawMetrics).forEach(key => {
        if (limits[key]) {
            // Formula: (value / max) * 100
            normalized[key] = Math.min(100, Math.max(0, (rawMetrics[key] / limits[key]) * 100));
        }
    });

    return normalized;
};

/**
 * Create a new athlete profile
 */
const createProfile = async (userId, profileData) => {
    const user = await User.findById(userId);

    // Ensure user role is athlete
    if (user.role !== 'athlete') {
        const error = new Error('Only athletes can create performance profiles');
        error.statusCode = 403;
        throw error;
    }

    // Prevent duplicate profile
    const existingProfile = await AthleteProfile.findOne({ userId });
    if (existingProfile) {
        const error = new Error('Athlete profile already exists');
        error.statusCode = 400;
        throw error;
    }

    // Calculate normalized metrics
    const normalizedMetrics = normalizeMetrics(profileData.rawMetrics || {});

    const profile = await AthleteProfile.create({
        userId,
        sportType: profileData.sportType,
        rawMetrics: profileData.rawMetrics,
        normalizedMetrics
    });

    return profile;
};

/**
 * Update existing athlete profile
 */
const updateProfile = async (userId, profileData) => {
    let profile = await AthleteProfile.findOne({ userId });

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    // Prevents manipulation of sensitive fields
    delete profileData.userId;
    delete profileData.isVerified;
    delete profileData.verifiedBy;

    // Recalculate normalized metrics if raw metrics are updated
    if (profileData.rawMetrics) {
        profileData.normalizedMetrics = normalizeMetrics(profileData.rawMetrics);
    }

    profile = await AthleteProfile.findOneAndUpdate(
        { userId },
        profileData,
        { new: true, runValidators: true }
    );

    return profile;
};

/**
 * Get profile by User ID
 */
const getProfileByUserId = async (userId) => {
    const profile = await AthleteProfile.findOne({ userId }).populate('userId', 'name email');
    return profile;
};

/**
 * Verify an athlete's profile (Scout Only)
 */
const verifyProfile = async (scoutId, athleteUserId) => {
    const scout = await User.findById(scoutId);

    // 1. Ensure scout role
    if (scout.role !== 'scout') {
        const error = new Error('Unauthorized: Only scouts can verify profiles');
        error.statusCode = 403;
        throw error;
    }

    // 2. Validate target user exists and has role 'athlete'
    const targetUser = await User.findById(athleteUserId);
    if (!targetUser) {
        const error = new Error('Athlete user not found');
        error.statusCode = 404;
        throw error;
    }

    if (targetUser.role !== 'athlete') {
        const error = new Error('Only athlete roles can be verified');
        error.statusCode = 400;
        throw error;
    }

    const profile = await AthleteProfile.findOneAndUpdate(
        { userId: athleteUserId },
        {
            isVerified: true,
            verifiedBy: scoutId
        },
        { new: true }
    );

    if (!profile) {
        const error = new Error('Athlete profile record not found');
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

module.exports = {
    createProfile,
    updateProfile,
    getProfileByUserId,
    verifyProfile
};

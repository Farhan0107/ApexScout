const asyncHandler = require('../middleware/asyncHandler');
const athleteProfileService = require('../services/athleteProfileService');
const sendResponse = require('../utils/sendResponse');

/**
 * @desc    Create athlete profile
 * @route   POST /api/v1/profile
 * @access  Private/Athlete
 */
exports.createProfile = asyncHandler(async (req, res, next) => {
    const profile = await athleteProfileService.createProfile(req.user._id, req.body);
    return sendResponse(res, 201, profile, 'Profile created successfully');
});

/**
 * @desc    Update athlete profile
 * @route   PUT /api/v1/profile
 * @access  Private/Athlete
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const profile = await athleteProfileService.updateProfile(req.user._id, req.body);
    return sendResponse(res, 200, profile, 'Profile updated successfully');
});

/**
 * @desc    Get current user's profile
 * @route   GET /api/v1/profile/me
 * @access  Private
 */
exports.getMyProfile = asyncHandler(async (req, res, next) => {
    const profile = await athleteProfileService.getProfileByUserId(req.user._id);

    if (!profile) {
        const error = new Error('No profile found for this athlete');
        error.statusCode = 404;
        throw error;
    }

    return sendResponse(res, 200, profile);
});

/**
 * @desc    Verify athlete profile (scout only)
 * @route   PATCH /api/v1/profile/verify/:athleteId
 * @access  Private/Scout
 */
exports.verifyProfile = asyncHandler(async (req, res, next) => {
    const { athleteId } = req.params;
    const profile = await athleteProfileService.verifyProfile(req.user._id, athleteId);
    return sendResponse(res, 200, profile, 'Profile verified successfully');
});

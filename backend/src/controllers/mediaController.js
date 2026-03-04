const asyncHandler = require('../middleware/asyncHandler');
const AthleteMedia = require('../models/AthleteMedia');
const sendResponse = require('../utils/sendResponse');

/**
 * @desc    Get athlete media by athleteId
 * @route   GET /api/v1/media/:athleteId
 * @access  Private
 */
exports.getAthleteMedia = asyncHandler(async (req, res, next) => {
    const media = await AthleteMedia.findOne({ athleteId: req.params.athleteId });
    if (!media) {
        return sendResponse(res, 200, { videoUrl: '', images: [], performanceClipUrl: '' });
    }
    return sendResponse(res, 200, media);
});

/**
 * @desc    Create or update athlete media
 * @route   POST /api/v1/media
 * @access  Private/Athlete
 */
exports.updateAthleteMedia = asyncHandler(async (req, res, next) => {
    const athleteId = req.user.userId;
    const { videoUrl, images, performanceClipUrl } = req.body;

    let media = await AthleteMedia.findOne({ athleteId });

    if (media) {
        media.videoUrl = videoUrl !== undefined ? videoUrl : media.videoUrl;
        media.images = images !== undefined ? images : media.images;
        media.performanceClipUrl = performanceClipUrl !== undefined ? performanceClipUrl : media.performanceClipUrl;
        await media.save();
    } else {
        media = await AthleteMedia.create({
            athleteId,
            videoUrl: videoUrl || '',
            images: images || [],
            performanceClipUrl: performanceClipUrl || ''
        });
    }

    return sendResponse(res, 200, media, 'Media highlights synchronized');
});

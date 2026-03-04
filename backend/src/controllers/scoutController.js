const asyncHandler = require('../middleware/asyncHandler');
const scoutService = require('../services/scoutService');
const sendResponse = require('../utils/sendResponse');

/**
 * @desc    Get athletes with filters
 * @route   GET /api/v1/scout/athletes
 * @access  Private/Scout
 */
exports.getAthletes = asyncHandler(async (req, res, next) => {
    const { count, totalPages, currentPage, data } = await scoutService.getAthletes(req.query);

    return sendResponse(res, 200, {
        count,
        totalPages,
        currentPage,
        data,
    });
});

/**
 * @desc    Compare two athletes
 * @route   GET /api/v1/scout/compare
 * @access  Private/Scout
 */
exports.compareAthletes = asyncHandler(async (req, res, next) => {
    const { id1, id2 } = req.query;

    if (!id1 || !id2) {
        const error = new Error('Provide two athlete IDs (id1, id2) for comparison');
        error.statusCode = 400;
        throw error;
    }

    const comparisonData = await scoutService.compareAthletes(id1, id2);

    return sendResponse(res, 200, comparisonData);
});

/**
 * @desc    Add athlete to watchlist
 * @route   POST /api/v1/scout/watchlist/:athleteId
 * @access  Private/Scout
 */
exports.addToWatchlist = asyncHandler(async (req, res, next) => {
    const { athleteId } = req.params;

    const watchlist = await scoutService.addToWatchlist(req.user._id, athleteId);

    return sendResponse(res, 201, watchlist, 'Athlete added to watchlist');
});

/**
 * @desc    Remove athlete from watchlist
 * @route   DELETE /api/v1/scout/watchlist/:athleteId
 * @access  Private/Scout
 */
exports.removeFromWatchlist = asyncHandler(async (req, res, next) => {
    const { athleteId } = req.params;

    await scoutService.removeFromWatchlist(req.user._id, athleteId);

    return sendResponse(res, 200, null, 'Successfully removed from watchlist');
});

/**
 * @desc    Get current scout's watchlist
 * @route   GET /api/v1/scout/watchlist
 * @access  Private/Scout
 */
exports.getWatchlist = asyncHandler(async (req, res, next) => {
    const watchlist = await scoutService.getWatchlist(req.user._id);

    return sendResponse(res, 200, watchlist);
});

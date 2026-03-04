const asyncHandler = require('../middleware/asyncHandler');
const {
    getAthletes,
    getAthleteById,
    compareAthletes,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist
} = require('../services/scoutService');
const ScoutAthleteMeta = require('../models/ScoutAthleteMeta');
const sendResponse = require('../utils/sendResponse');

/**
 * @desc    Get scout analytics
 * @route   GET /api/v1/scout/analytics
 * @access  Private/Scout
 */
exports.getAnalytics = asyncHandler(async (req, res, next) => {
    const scoutId = req.user._id;

    // 1. Fetch all meta for this scout
    const allMeta = await ScoutAthleteMeta.find({ scoutId }).populate('athleteId', 'name email').lean();

    const stats = {
        Prospect: 0,
        Shortlisted: 0,
        Contacted: 0,
        Signed: 0,
        Pass: 0
    };

    allMeta.forEach(m => {
        if (stats.hasOwnProperty(m.status)) {
            stats[m.status]++;
        }
    });

    const avgRating = allMeta.length > 0
        ? (allMeta.reduce((acc, current) => acc + (current.rating || 0), 0) / allMeta.length).toFixed(1)
        : 0;

    // Top rated athlete
    const topRatedAthlete = allMeta.length > 0
        ? [...allMeta].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
        : null;

    return sendResponse(res, 200, {
        totalProspects: stats.Prospect,
        shortlisted: stats.Shortlisted,
        contacted: stats.Contacted,
        signed: stats.Signed,
        averageRating: Number(avgRating),
        pipelineDistribution: stats,
        topRatedAthlete: topRatedAthlete ? {
            id: topRatedAthlete.athleteId?._id || topRatedAthlete.athleteId,
            name: topRatedAthlete.athleteId?.name || 'Unknown',
            rating: topRatedAthlete.rating
        } : null
    });
});

/**
 * @desc    Get athletes with filters
 * @route   GET /api/v1/scout/athletes
 * @access  Private/Scout
 */
exports.getAthletes = asyncHandler(async (req, res, next) => {
    const result = await getAthletes(req.query);
    return sendResponse(res, 200, result);
});

/**
 * @desc    Get athlete by ID
 * @route   GET /api/v1/scout/athletes/:id
 * @access  Private/Scout
 */
exports.getAthleteById = asyncHandler(async (req, res, next) => {
    const athlete = await getAthleteById(req.params.id);
    return sendResponse(res, 200, athlete);
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

    const comparisonData = await compareAthletes(id1, id2);
    return sendResponse(res, 200, comparisonData);
});

/**
 * @desc    Add athlete to watchlist
 * @route   POST /api/v1/scout/watchlist/:athleteId
 * @access  Private/Scout
 */
exports.addToWatchlist = asyncHandler(async (req, res, next) => {
    const { athleteId } = req.params;
    const { status } = req.body;
    const watchlist = await addToWatchlist(req.user._id, athleteId, status);
    return sendResponse(res, 201, watchlist, 'Athlete added to watchlist');
});

/**
 * @desc    Remove athlete from watchlist
 * @route   DELETE /api/v1/scout/watchlist/:athleteId
 * @access  Private/Scout
 */
exports.removeFromWatchlist = asyncHandler(async (req, res, next) => {
    const { athleteId } = req.params;
    await removeFromWatchlist(req.user._id, athleteId);
    return sendResponse(res, 200, null, 'Successfully removed from watchlist');
});

/**
 * @desc    Get current scout's watchlist
 * @route   GET /api/v1/scout/watchlist
 * @access  Private/Scout
 */
exports.getWatchlist = asyncHandler(async (req, res, next) => {
    const watchlist = await getWatchlist(req.user._id);
    return sendResponse(res, 200, watchlist);
});

/**
 * @desc    Update athlete pipeline stage
 * @route   PATCH /api/v1/scout/pipeline/:athleteId
 * @access  Private/Scout
 */
exports.updatePipelineStage = asyncHandler(async (req, res, next) => {
    const { athleteId } = req.params;
    const { status } = req.body;

    const meta = await ScoutAthleteMeta.findOneAndUpdate(
        { scoutId: req.user._id, athleteId },
        { status },
        { new: true, runValidators: true, upsert: true }
    );

    return sendResponse(res, 200, meta, 'Pipeline stage updated successfully');
});

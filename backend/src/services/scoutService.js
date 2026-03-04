const AthleteProfile = require('../models/AthleteProfile');
const Watchlist = require('../models/Watchlist');
const User = require('../models/User');

/**
 * Get athletes based on search and filters
 * @param {Object} queryParams 
 */
const getAthletes = async (queryParams) => {
    const {
        search,
        sportType,
        minVerticalLeap,
        minSpeed,
        minPointsPerGame,
        isVerified,
        sortBy,
        page = 1,
        limit = 10
    } = queryParams;

    // 1. Build Query Object
    const query = {};

    if (search) {
        // Find users matching search name
        const users = await User.find({
            name: { $regex: search, $options: 'i' },
            role: 'athlete'
        }).select('_id');
        const userIds = users.map(u => u._id);
        query.userId = { $in: userIds };
    }

    if (sportType) query.sportType = sportType;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    // Range filters for metrics (using Normalized 0-100 scale for UI consistency)
    if (minVerticalLeap) query['normalizedMetrics.verticalLeap'] = { $gte: Number(minVerticalLeap) };
    if (minSpeed) query['normalizedMetrics.speed'] = { $gte: Number(minSpeed) };
    if (minPointsPerGame) query['normalizedMetrics.pointsPerGame'] = { $gte: Number(minPointsPerGame) };

    // 2. Define allowed sorting fields
    const allowedSortFields = [
        'createdAt',
        'normalizedMetrics.verticalLeap',
        'normalizedMetrics.speed',
        'normalizedMetrics.pointsPerGame'
    ];
    let sort = '-createdAt';
    if (sortBy && allowedSortFields.includes(sortBy)) {
        sort = sortBy === '-createdAt' ? sortBy : `-${sortBy}`; // Always sort descending for metrics
    }

    // 3. Execution (Pagination + Lean)
    // Protection: Cap the limit to 100 to prevent DoS via large result sets
    const finalLimit = Math.min(Number(limit), 100);
    const skip = (Number(page) - 1) * finalLimit;

    const athletes = await AthleteProfile.find(query)
        .populate('userId', 'name email')
        .select('-rawMetrics -__v') // Exclude heavy/sensitive fields
        .sort(sort)
        .skip(skip)
        .limit(finalLimit)
        .lean();

    const count = await AthleteProfile.countDocuments(query);

    return {
        count,
        totalPages: Math.ceil(count / finalLimit),
        currentPage: Number(page),
        data: athletes
    };
};

/**
 * Get detailed athlete profile by ID
 */
const getAthleteById = async (id) => {
    const athlete = await AthleteProfile.findOne({ userId: id })
        .populate('userId', 'name email')
        .select('-__v')
        .lean();

    if (!athlete) {
        const error = new Error('Athlete profile not found');
        error.statusCode = 404;
        throw error;
    }

    return athlete;
};

/**
 * Compare two athletes
 */
const compareAthletes = async (athleteId1, athleteId2) => {
    const profiles = await AthleteProfile.find({
        userId: { $in: [athleteId1, athleteId2] }
    })
        .select('userId normalizedMetrics sportType')
        .populate('userId', 'name')
        .lean();

    if (profiles.length < 2) {
        const error = new Error('One or both athlete profiles not found');
        error.statusCode = 404;
        throw error;
    }

    return profiles;
};

/**
 * Add athlete to scout watchlist
 */
const addToWatchlist = async (scoutId, athleteId) => {
    // Check if athlete exists (using lean for performance)
    const athlete = await User.findOne({ _id: athleteId, role: 'athlete' }).lean();
    if (!athlete) {
        const error = new Error('Athlete user not found');
        error.statusCode = 404;
        throw error;
    }

    const item = await Watchlist.create({
        scoutId,
        athleteId
    });

    return item;
};

/**
 * Remove athlete from scout watchlist
 */
const removeFromWatchlist = async (scoutId, athleteId) => {
    const result = await Watchlist.findOneAndDelete({ scoutId, athleteId });

    if (!result) {
        const error = new Error('Watchlist item not found');
        error.statusCode = 404;
        throw error;
    }

    return result;
};

/**
 * Get scout's watchlist
 */
const getWatchlist = async (scoutId) => {
    // 1. Fetch the base watchlist
    const watchlist = await Watchlist.find({ scoutId })
        .populate({
            path: 'athleteId',
            select: 'name email'
        })
        .lean();

    // 2. Hydrate each item with Profile and Meta intelligence
    const hydratedList = await Promise.all(watchlist.map(async (item) => {
        const athleteId = item.athleteId?._id || item.athleteId;

        // Fetch profile (for sportType and normalized metrics)
        const profile = await AthleteProfile.findOne({ userId: athleteId })
            .select('sportType normalizedMetrics isVerified')
            .lean();

        // Fetch scout-specific meta (for rating and status)
        const ScoutAthleteMeta = require('../models/ScoutAthleteMeta');
        const meta = await ScoutAthleteMeta.findOne({ scoutId, athleteId })
            .select('rating status notes')
            .lean();

        // Merge everything into the athlete object
        return {
            ...item,
            athleteId: {
                ...item.athleteId,
                sportType: profile?.sportType || 'Not Specified',
                normalizedMetrics: profile?.normalizedMetrics || {},
                isVerified: profile?.isVerified || false
            },
            meta: meta || { rating: 1, status: 'Prospect', notes: '' }
        };
    }));

    return hydratedList;
};

module.exports = {
    getAthletes,
    getAthleteById,
    compareAthletes,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist
};

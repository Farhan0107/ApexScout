const express = require('express');
const {
    getAthletes,
    getAthleteById,
    getAnalytics,
    compareAthletes,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist
} = require('../controllers/scoutController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply protection and scout-only authorization for all scout-marketplace routes
router.use(protect);
router.use(authorize('scout'));

router.get('/athletes', getAthletes);
router.get('/analytics', getAnalytics);
router.get('/athletes/:id', getAthleteById);
router.get('/compare', compareAthletes);

router.post('/watchlist/:athleteId', addToWatchlist);
router.delete('/watchlist/:athleteId', removeFromWatchlist);
router.get('/watchlist', getWatchlist);

module.exports = router;

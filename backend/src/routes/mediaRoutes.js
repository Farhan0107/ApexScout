const express = require('express');
const { getAthleteMedia, updateAthleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

// Scouts and Athletes can see media
router.get('/:athleteId', getAthleteMedia);

// Only athletes can update their own highlights
router.post('/', authorize('athlete'), updateAthleteMedia);
router.put('/', authorize('athlete'), updateAthleteMedia);

module.exports = router;

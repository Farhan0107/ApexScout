const express = require('express');
const {
    createProfile,
    updateProfile,
    getMyProfile,
    verifyProfile
} = require('../controllers/athleteProfileController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { createProfileSchema, updateProfileSchema } = require('../validators/profileValidator');

const router = express.Router();

// Routes for current user
router.get('/me', protect, getMyProfile);
router.post('/', protect, authorize('athlete'), validate(createProfileSchema), createProfile);
router.put('/', protect, authorize('athlete'), validate(updateProfileSchema), updateProfile);

// Verification route (Scout Only)
router.patch('/verify/:athleteId', protect, authorize('scout'), verifyProfile);

module.exports = router;

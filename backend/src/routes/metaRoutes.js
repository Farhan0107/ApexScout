const express = require('express');
const { getMeta, updateMeta } = require('../controllers/metaController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('scout'));

router.get('/:athleteId', getMeta);
router.post('/:athleteId', updateMeta);
router.put('/:athleteId', updateMeta);

module.exports = router;

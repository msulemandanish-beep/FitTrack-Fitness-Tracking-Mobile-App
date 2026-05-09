const express = require('express');
const router = express.Router();
const { logProgress, getProgress, getStats, deleteProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logProgress);
router.get('/', protect, getProgress);
router.get('/stats', protect, getStats);
router.delete('/:id', protect, deleteProgress);

module.exports = router;

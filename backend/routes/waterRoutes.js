const express = require('express');
const router = express.Router();
const { getTodayWater, addWater, updateGoal, resetWater } = require('../controllers/waterController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getTodayWater);
router.post('/add', protect, addWater);
router.put('/goal', protect, updateGoal);
router.delete('/reset', protect, resetWater);

module.exports = router;

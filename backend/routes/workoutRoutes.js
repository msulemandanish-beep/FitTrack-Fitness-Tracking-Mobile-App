const express = require('express');
const router = express.Router();
const { getCategories, getWorkoutsByCategory, getWorkoutById, seedWorkoutData } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.get('/categories', protect, getCategories);
router.get('/detail/:id', protect, getWorkoutById);
router.get('/:category', protect, getWorkoutsByCategory);
router.post('/seed', seedWorkoutData); // No auth - for dev only

module.exports = router;

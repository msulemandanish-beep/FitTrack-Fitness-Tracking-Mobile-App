const Progress = require('../models/Progress');

// @desc  Log a completed workout
// @route POST /api/progress
const logProgress = async (req, res) => {
  try {
    const { workoutName, category, duration, caloriesBurned, notes } = req.body;
    const progress = await Progress.create({
      user: req.user._id,
      workoutName,
      category,
      duration,
      caloriesBurned,
      notes,
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get user progress history
// @route GET /api/progress
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(30);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get progress stats summary
// @route GET /api/progress/stats
const getStats = async (req, res) => {
  try {
    const all = await Progress.find({ user: req.user._id });

    const totalWorkouts = all.length;
    const totalMinutes = all.reduce((sum, p) => sum + p.duration, 0);
    const totalCalories = all.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);

    // Category breakdown
    const categoryMap = {};
    all.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });

    // Weekly data (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = all.filter((p) => new Date(p.completedAt) >= weekAgo);

    res.json({
      totalWorkouts,
      totalMinutes,
      totalCalories,
      categoryBreakdown: categoryMap,
      thisWeekCount: thisWeek.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a progress entry
// @route DELETE /api/progress/:id
const deleteProgress = async (req, res) => {
  try {
    const entry = await Progress.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    await entry.deleteOne();
    res.json({ message: 'Entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logProgress, getProgress, getStats, deleteProgress };

const Water = require('../models/Water');

const getTodayDate = () => new Date().toISOString().split('T')[0];

// @desc  Get today's water log
// @route GET /api/water/today
const getTodayWater = async (req, res) => {
  try {
    const date = getTodayDate();
    let record = await Water.findOne({ user: req.user._id, date });

    if (!record) {
      record = await Water.create({ user: req.user._id, date, intakeMl: 0, goalMl: 2500, logs: [] });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add water intake
// @route POST /api/water/add
const addWater = async (req, res) => {
  try {
    const { amount } = req.body; // ml
    const date = getTodayDate();

    let record = await Water.findOne({ user: req.user._id, date });
    if (!record) {
      record = await Water.create({ user: req.user._id, date, intakeMl: 0, goalMl: 2500, logs: [] });
    }

    record.intakeMl += amount;
    record.logs.push({ amount, time: new Date() });
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update daily goal
// @route PUT /api/water/goal
const updateGoal = async (req, res) => {
  try {
    const { goalMl } = req.body;
    const date = getTodayDate();

    let record = await Water.findOneAndUpdate(
      { user: req.user._id, date },
      { goalMl },
      { new: true, upsert: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Reset today's water
// @route DELETE /api/water/reset
const resetWater = async (req, res) => {
  try {
    const date = getTodayDate();
    await Water.findOneAndUpdate(
      { user: req.user._id, date },
      { intakeMl: 0, logs: [] },
      { new: true }
    );
    res.json({ message: 'Water intake reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodayWater, addWater, updateGoal, resetWater };

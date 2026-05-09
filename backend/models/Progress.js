const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutName: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    caloriesBurned: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);

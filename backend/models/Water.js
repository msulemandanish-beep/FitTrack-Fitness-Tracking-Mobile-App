const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
      type: String, // stored as YYYY-MM-DD
      required: true,
    },
    intakeMl: { type: Number, default: 0 },
    goalMl: { type: Number, default: 2500 },
    logs: [
      {
        amount: Number,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Compound unique index: one record per user per day
waterSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Water', waterSchema);

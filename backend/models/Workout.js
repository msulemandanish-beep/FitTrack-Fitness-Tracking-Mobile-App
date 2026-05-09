const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: String, default: '10' },
  duration: { type: Number }, // seconds
  restTime: { type: Number, default: 60 }, // seconds
  instructions: { type: String },
  muscleGroup: { type: String },
});

const workoutSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body'],
    },
    name: { type: String, required: true },
    description: { type: String },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'elite'],
      default: 'intermediate',
    },
    duration: { type: Number, default: 45 }, // minutes
    exercises: [exerciseSchema],
    imageKey: { type: String }, // for local image mapping
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);

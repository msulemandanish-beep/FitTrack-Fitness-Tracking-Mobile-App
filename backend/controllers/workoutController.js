const Workout = require('../models/Workout');

// Seed data for workouts
const seedWorkouts = [
  {
    category: 'chest',
    name: 'Iron Chest Protocol',
    description: 'Forge a chest built for combat. No shortcuts.',
    difficulty: 'intermediate',
    duration: 50,
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', muscleGroup: 'Chest', instructions: 'Full range. Control the descent. Explode up.' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', muscleGroup: 'Upper Chest', instructions: 'Feel the stretch. Don\'t bounce off the chest.' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', muscleGroup: 'Chest', instructions: 'Squeeze at peak contraction. Hold for 1 second.' },
      { name: 'Push-Ups', sets: 3, reps: '20', muscleGroup: 'Chest', instructions: 'Chest to floor. Strict form only.' },
    ],
  },
  {
    category: 'back',
    name: 'Warlord Back Builder',
    description: 'Build a back that commands respect.',
    difficulty: 'intermediate',
    duration: 55,
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5-6', muscleGroup: 'Full Back', instructions: 'Spine neutral. Drive through the floor. Own every rep.' },
      { name: 'Pull-Ups', sets: 4, reps: '8-10', muscleGroup: 'Lats', instructions: 'Full dead hang to chin over bar. No kipping.' },
      { name: 'Bent Over Row', sets: 3, reps: '10', muscleGroup: 'Mid Back', instructions: 'Row to the hip. Elbows back, not out.' },
      { name: 'Lat Pulldown', sets: 3, reps: '12', muscleGroup: 'Lats', instructions: 'Lean back slightly. Pull to the upper chest.' },
    ],
  },
  {
    category: 'legs',
    name: 'Combat Legs Assault',
    description: 'Legs of steel. Pain is temporary. Weakness is permanent.',
    difficulty: 'elite',
    duration: 60,
    exercises: [
      { name: 'Back Squat', sets: 5, reps: '5', muscleGroup: 'Quads/Glutes', instructions: 'Below parallel. No excuses.' },
      { name: 'Romanian Deadlift', sets: 4, reps: '10', muscleGroup: 'Hamstrings', instructions: 'Hinge at the hip. Feel the hamstring load.' },
      { name: 'Leg Press', sets: 3, reps: '15', muscleGroup: 'Quads', instructions: 'Full depth. Drive through heels.' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', muscleGroup: 'Quads/Glutes', instructions: 'Knee one inch from floor. Stay upright.' },
      { name: 'Calf Raises', sets: 4, reps: '20', muscleGroup: 'Calves', instructions: 'Slow negative. Pause at bottom.' },
    ],
  },
  {
    category: 'shoulders',
    name: 'Cannonball Shoulders',
    description: 'Wide shoulders. Wide presence. Dominant in every room.',
    difficulty: 'intermediate',
    duration: 45,
    exercises: [
      { name: 'Military Press', sets: 4, reps: '8', muscleGroup: 'Delts', instructions: 'Bar from chin, overhead. Lock out at top.' },
      { name: 'Lateral Raises', sets: 4, reps: '15', muscleGroup: 'Side Delts', instructions: 'Slight bend in elbow. Lead with elbows, not hands.' },
      { name: 'Face Pulls', sets: 3, reps: '15', muscleGroup: 'Rear Delts', instructions: 'Pull to forehead level. External rotation.' },
      { name: 'Arnold Press', sets: 3, reps: '12', muscleGroup: 'Delts', instructions: 'Rotate palms on the way up. Full range.' },
    ],
  },
  {
    category: 'arms',
    name: 'Weapon Arms Training',
    description: 'Arms that look like weapons. Train accordingly.',
    difficulty: 'beginner',
    duration: 40,
    exercises: [
      { name: 'Barbell Curl', sets: 4, reps: '10', muscleGroup: 'Biceps', instructions: 'No swing. Squeeze at top. Slow negative.' },
      { name: 'Hammer Curl', sets: 3, reps: '12', muscleGroup: 'Biceps/Brachialis', instructions: 'Neutral grip. Control the weight down.' },
      { name: 'Skull Crushers', sets: 4, reps: '10', muscleGroup: 'Triceps', instructions: 'Bar to forehead. Press to full lockout.' },
      { name: 'Tricep Pushdown', sets: 3, reps: '15', muscleGroup: 'Triceps', instructions: 'Elbows locked at sides. Squeeze at bottom.' },
    ],
  },
  {
    category: 'core',
    name: 'Steel Core Protocol',
    description: 'Your core is your foundation. Make it unbreakable.',
    difficulty: 'intermediate',
    duration: 30,
    exercises: [
      { name: 'Plank', sets: 3, reps: '60 seconds', muscleGroup: 'Core', instructions: 'Straight line head to heels. Breathe through it.' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '15', muscleGroup: 'Lower Abs', instructions: 'No swing. Controlled movement only.' },
      { name: 'Cable Crunches', sets: 3, reps: '20', muscleGroup: 'Abs', instructions: 'Round the spine. Feel the contraction.' },
      { name: 'Russian Twists', sets: 3, reps: '20 each side', muscleGroup: 'Obliques', instructions: 'Feet off floor for maximum difficulty.' },
    ],
  },
  {
    category: 'cardio',
    name: 'Savage Cardio Blitz',
    description: 'Endurance is power. Outlast everyone.',
    difficulty: 'intermediate',
    duration: 35,
    exercises: [
      { name: 'Burpees', sets: 5, reps: '10', muscleGroup: 'Full Body', instructions: 'Explosive jump at the top. No half reps.' },
      { name: 'Box Jumps', sets: 4, reps: '10', muscleGroup: 'Legs/Cardio', instructions: 'Land softly. Step down, don\'t jump down.' },
      { name: 'Battle Ropes', sets: 4, reps: '30 seconds', muscleGroup: 'Upper Body', instructions: 'Alternate waves. Keep core tight.' },
      { name: 'Sprint Intervals', sets: 6, reps: '20 seconds on / 10 off', muscleGroup: 'Full Body', instructions: 'Maximum effort on every sprint.' },
    ],
  },
  {
    category: 'full_body',
    name: 'Total War Protocol',
    description: 'No muscle left untested. Full destruction. Full rebuild.',
    difficulty: 'elite',
    duration: 75,
    exercises: [
      { name: 'Power Clean', sets: 4, reps: '5', muscleGroup: 'Full Body', instructions: 'Explosive pull. Drop under the bar fast.' },
      { name: 'Front Squat', sets: 3, reps: '8', muscleGroup: 'Quads/Core', instructions: 'Elbows high. Upright torso throughout.' },
      { name: 'Pull-Ups', sets: 3, reps: '10', muscleGroup: 'Back/Biceps', instructions: 'Dead hang to chin over. No momentum.' },
      { name: 'Dips', sets: 3, reps: '12', muscleGroup: 'Chest/Triceps', instructions: 'Lean forward for chest emphasis. Full depth.' },
      { name: 'Farmer\'s Walk', sets: 3, reps: '40 meters', muscleGroup: 'Full Body', instructions: 'Heavy as possible. Walk with purpose.' },
    ],
  },
];

// @desc  Get all workout categories
// @route GET /api/workouts/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Workout.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get workouts by category
// @route GET /api/workouts/:category
const getWorkoutsByCategory = async (req, res) => {
  try {
    const workouts = await Workout.find({ category: req.params.category });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single workout
// @route GET /api/workouts/detail/:id
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Seed workouts (dev utility)
// @route POST /api/workouts/seed
const seedWorkoutData = async (req, res) => {
  try {
    await Workout.deleteMany({});
    const workouts = await Workout.insertMany(seedWorkouts);
    res.json({ message: `${workouts.length} workouts seeded successfully`, workouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, getWorkoutsByCategory, getWorkoutById, seedWorkoutData };

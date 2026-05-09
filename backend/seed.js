const mongoose = require("mongoose");
const Workout = require("./models/Workout");
require("dotenv").config();

// ==============================
// LARGE FITNESS DATASET
// ==============================
const seedWorkouts = [
  {
    category: "chest",
    name: "Iron Chest Protocol",
    description: "Forge a chest built for combat. Maximum hypertrophy and strength.",
    difficulty: "intermediate",
    duration: 55,
    exercises: [
      { name: "Barbell Bench Press", sets: 5, reps: "5-8", muscleGroup: "Chest", instructions: "Heavy controlled reps. No bounce." },
      { name: "Incline Dumbbell Press", sets: 4, reps: "8-12", muscleGroup: "Upper Chest", instructions: "Full stretch at bottom." },
      { name: "Decline Bench Press", sets: 3, reps: "10", muscleGroup: "Lower Chest", instructions: "Slow negative phase." },
      { name: "Cable Fly", sets: 4, reps: "12-15", muscleGroup: "Chest", instructions: "Squeeze hard at peak." },
      { name: "Push Ups", sets: 3, reps: "Failure", muscleGroup: "Chest", instructions: "Full range strict form." }
    ]
  },

  {
    category: "back",
    name: "Warlord Back Builder",
    description: "Width, thickness, and dominance.",
    difficulty: "intermediate",
    duration: 60,
    exercises: [
      { name: "Deadlift", sets: 5, reps: "5", muscleGroup: "Full Back", instructions: "Explosive but controlled." },
      { name: "Pull Ups", sets: 4, reps: "8-12", muscleGroup: "Lats", instructions: "No swinging." },
      { name: "Barbell Row", sets: 4, reps: "8-10", muscleGroup: "Mid Back", instructions: "Pull to stomach." },
      { name: "Lat Pulldown", sets: 4, reps: "10-12", muscleGroup: "Lats", instructions: "Full contraction." },
      { name: "Seated Cable Row", sets: 3, reps: "12", muscleGroup: "Back", instructions: "Pause at contraction." }
    ]
  },

  {
    category: "legs",
    name: "Combat Leg Assault",
    description: "Build unstoppable lower body strength.",
    difficulty: "elite",
    duration: 70,
    exercises: [
      { name: "Back Squat", sets: 5, reps: "5", muscleGroup: "Quads", instructions: "Below parallel." },
      { name: "Front Squat", sets: 4, reps: "6-8", muscleGroup: "Quads/Core", instructions: "Keep torso upright." },
      { name: "Romanian Deadlift", sets: 4, reps: "8-10", muscleGroup: "Hamstrings", instructions: "Slow eccentric." },
      { name: "Leg Press", sets: 4, reps: "12-15", muscleGroup: "Quads", instructions: "Full depth." },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", muscleGroup: "Legs", instructions: "Controlled steps." },
      { name: "Calf Raises", sets: 5, reps: "15-20", muscleGroup: "Calves", instructions: "Pause at top." }
    ]
  },

  {
    category: "shoulders",
    name: "Cannonball Shoulder Protocol",
    description: "Round, wide, dominant shoulders.",
    difficulty: "intermediate",
    duration: 50,
    exercises: [
      { name: "Military Press", sets: 5, reps: "6-8", muscleGroup: "Delts", instructions: "Strict press." },
      { name: "Arnold Press", sets: 4, reps: "10", muscleGroup: "Delts", instructions: "Rotate fully." },
      { name: "Lateral Raises", sets: 4, reps: "12-15", muscleGroup: "Side Delts", instructions: "No momentum." },
      { name: "Front Raises", sets: 3, reps: "12", muscleGroup: "Front Delts", instructions: "Controlled lift." },
      { name: "Face Pulls", sets: 4, reps: "15", muscleGroup: "Rear Delts", instructions: "Pull to face level." }
    ]
  },

  {
    category: "arms",
    name: "Weapon Arms Protocol",
    description: "Arms built for dominance and presence.",
    difficulty: "beginner",
    duration: 45,
    exercises: [
      { name: "Barbell Curl", sets: 4, reps: "10", muscleGroup: "Biceps", instructions: "No swing." },
      { name: "Hammer Curl", sets: 4, reps: "12", muscleGroup: "Biceps/Brachialis", instructions: "Neutral grip." },
      { name: "Concentration Curl", sets: 3, reps: "12", muscleGroup: "Biceps", instructions: "Strict control." },
      { name: "Skull Crushers", sets: 4, reps: "10", muscleGroup: "Triceps", instructions: "Lower to forehead." },
      { name: "Tricep Pushdown", sets: 4, reps: "12-15", muscleGroup: "Triceps", instructions: "Full lockout." },
      { name: "Dips", sets: 3, reps: "Failure", muscleGroup: "Chest/Triceps", instructions: "Deep range." }
    ]
  },

  {
    category: "core",
    name: "Steel Core Protocol",
    description: "Unbreakable core strength system.",
    difficulty: "intermediate",
    duration: 35,
    exercises: [
      { name: "Plank", sets: 4, reps: "60 sec", muscleGroup: "Core", instructions: "Straight body." },
      { name: "Hanging Leg Raises", sets: 4, reps: "12-15", muscleGroup: "Lower Abs", instructions: "No swing." },
      { name: "Cable Crunch", sets: 4, reps: "15-20", muscleGroup: "Abs", instructions: "Crunch spine." },
      { name: "Russian Twist", sets: 4, reps: "20 each side", muscleGroup: "Obliques", instructions: "Controlled twist." },
      { name: "Mountain Climbers", sets: 3, reps: "45 sec", muscleGroup: "Core/Cardio", instructions: "Fast pace." }
    ]
  },

  {
    category: "cardio",
    name: "Savage Cardio Blitz",
    description: "Endurance beyond limits.",
    difficulty: "intermediate",
    duration: 40,
    exercises: [
      { name: "Burpees", sets: 5, reps: "12", muscleGroup: "Full Body", instructions: "Explosive reps." },
      { name: "Jump Rope", sets: 4, reps: "2 min", muscleGroup: "Cardio", instructions: "Fast rhythm." },
      { name: "Sprints", sets: 6, reps: "30 sec", muscleGroup: "Legs", instructions: "Max speed." },
      { name: "Mountain Climbers", sets: 4, reps: "45 sec", muscleGroup: "Core/Cardio", instructions: "High intensity." },
      { name: "High Knees", sets: 3, reps: "1 min", muscleGroup: "Cardio", instructions: "Explosive movement." }
    ]
  },

  {
    category: "full_body",
    name: "Total War Protocol",
    description: "Full system destruction and rebuild.",
    difficulty: "elite",
    duration: 80,
    exercises: [
      { name: "Clean & Press", sets: 5, reps: "5", muscleGroup: "Full Body", instructions: "Explosive lift." },
      { name: "Front Squat", sets: 4, reps: "8", muscleGroup: "Legs/Core", instructions: "Stay upright." },
      { name: "Pull Ups", sets: 4, reps: "10", muscleGroup: "Back", instructions: "Strict form." },
      { name: "Dips", sets: 4, reps: "12", muscleGroup: "Chest/Triceps", instructions: "Deep range." },
      { name: "Kettlebell Swings", sets: 4, reps: "15", muscleGroup: "Full Body", instructions: "Explosive hips." },
      { name: "Farmer Walk", sets: 3, reps: "40m", muscleGroup: "Full Body", instructions: "Heavy grip walk." }
    ]
  }
];

// ==============================
// DATABASE SEED SCRIPT
// ==============================
const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected!");

    await Workout.deleteMany({});
    console.log("Old data cleared");

    const inserted = await Workout.insertMany(seedWorkouts);
    console.log(`Inserted: ${inserted.length} workouts`);

    console.log("🔥 DATABASE SEEDED SUCCESSFULLY");

    process.exit();
  } catch (err) {
    console.log("Seed error:", err);
    process.exit(1);
  }
};

seedDB();
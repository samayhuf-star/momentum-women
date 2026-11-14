export type Exercise = {
  id: string;
  name: string;
  category: 'Lower Body' | 'Upper Body' | 'Core' | 'Full Body';
  equipment: 'None' | 'Dumbbells' | 'Resistance Band' | 'Gym';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscles: string[];
  description: string;
  hidden?: boolean;
};

export const exercises: Exercise[] = [
  // Lower Body (18)
  { id: 'goblet-squat', name: 'Goblet Squat', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Quads', 'Glutes'], description: 'Hold dumbbell at chest, squat deep with heels down.' },
  { id: 'rdl', name: 'Romanian Deadlift', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Hamstrings', 'Glutes'], description: 'Hinge at hips, soft knee bend, feel stretch in hamstrings.' },
  { id: 'glute-bridge', name: 'Glute Bridge', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Glutes'], description: 'Drive hips up, squeeze glutes at top, keep ribs down.' },
  { id: 'hip-thrust', name: 'Hip Thrust', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Glutes'], description: 'Shoulders on bench, drive through heels, full hip extension.' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Quads', 'Glutes'], description: 'Rear foot elevated, front knee tracks over toes.' },
  { id: 'lateral-lunge', name: 'Lateral Lunge', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Glutes', 'Adductors'], description: 'Step wide, sit back into the working leg, keep chest up.' },
  { id: 'sumo-squat', name: 'Sumo Squat', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Inner Thighs', 'Glutes'], description: 'Wide stance, toes out, sink low between knees.' },
  { id: 'step-up', name: 'Step-Up', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Quads', 'Glutes'], description: 'Drive through the full foot on the step, control the descent.' },
  { id: 'walking-lunge', name: 'Walking Lunge', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Quads', 'Glutes'], description: 'Long strides, front knee over ankle, upright torso.' },
  { id: 'reverse-lunge', name: 'Reverse Lunge', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Quads', 'Glutes'], description: 'Step back, drop into lunge, drive through front heel to return.' },
  { id: 'curtsy-lunge', name: 'Curtsy Lunge', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Glutes', 'Outer Thigh'], description: 'Cross back leg behind, lower with control, focus on glute.' },
  { id: 'single-leg-rdl', name: 'Single-Leg RDL', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Hamstrings', 'Glutes'], description: 'Hinge on one leg, free leg extends back, keep hips square.' },
  { id: 'calf-raise', name: 'Calf Raise', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Calves'], description: 'Rise onto toes, pause at top, lower slowly.' },
  { id: 'frog-pump', name: 'Frog Pump', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Glutes'], description: 'Soles of feet together, drive hips up with glute squeeze.' },
  { id: 'fire-hydrant', name: 'Fire Hydrant', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Glutes', 'Outer Thigh'], description: 'On all fours, lift knee out to the side, keep hips level.' },
  { id: 'donkey-kick', name: 'Donkey Kick', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Glutes'], description: 'On all fours, kick heel toward ceiling, squeeze at top.' },
  { id: 'wall-sit', name: 'Wall Sit', category: 'Lower Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Quads'], description: 'Back against wall, thighs parallel to floor, hold.' },
  { id: 'good-morning', name: 'Good Morning', category: 'Lower Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Hamstrings', 'Lower Back'], description: 'Soft knee bend, hinge forward with straight back.' },

  // Upper Body (12)
  { id: 'push-up', name: 'Push-Up', category: 'Upper Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Chest', 'Triceps', 'Shoulders'], description: 'Hands under shoulders, body in a straight line, lower with control.' },
  { id: 'dumbbell-press', name: 'Dumbbell Bench Press', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Chest', 'Triceps'], description: 'Press dumbbells from chest to full extension, control the descent.' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Shoulders'], description: 'Raise arms to shoulder height with slight bend, lower slowly.' },
  { id: 'band-press', name: 'Band Chest Press', category: 'Upper Body', equipment: 'Resistance Band', difficulty: 'Beginner', muscles: ['Chest'], description: 'Constant tension press.' },
  { id: 'shoulder-press', name: 'Shoulder Press', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Shoulders'], description: 'Press overhead with control.' },
  { id: 'front-raise', name: 'Front Raise', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Shoulders'], description: 'Raise forward to shoulder height.' },
  { id: 'biceps-curl', name: 'Biceps Curl', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Biceps'], description: 'Curl with control, no swing.' },
  { id: 'triceps-ext', name: 'Triceps Extension', category: 'Upper Body', equipment: 'Resistance Band', difficulty: 'Beginner', muscles: ['Triceps'], description: 'Extend arms fully.' },
  { id: 'incline-press', name: 'Incline Dumbbell Press', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Upper Chest'], description: 'Upper chest focus, squeeze at top.' },
  { id: 'rear-delt', name: 'Rear Delt Fly', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Rear Delts'], description: 'Bend forward, raise arms to sides.' },
  { id: 'row', name: 'Dumbbell Row', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Beginner', muscles: ['Back', 'Biceps'], description: 'Hinge, pull elbow back, squeeze shoulder blade.' },
  { id: 'overhead-ext', name: 'Overhead Triceps Extension', category: 'Upper Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Triceps'], description: 'Keep elbows close, extend fully.' },

  // Core (11 visible)
  { id: 'bicycle-crunches', name: 'Bicycle Crunches', category: 'Core', equipment: 'None', difficulty: 'Beginner', muscles: ['Obliques', 'Abs'], description: 'Elbow to opposite knee, extend the other leg slowly.' },
  { id: 'leg-raises', name: 'Leg Raises', category: 'Core', equipment: 'None', difficulty: 'Intermediate', muscles: ['Lower Abs'], description: 'Lower legs slowly without letting your lower back lift.' },
  { id: 'russian-twist', name: 'Russian Twist', category: 'Core', equipment: 'None', difficulty: 'Intermediate', muscles: ['Obliques'], description: 'Rotate fully. Keep feet elevated if possible.' },
  { id: 'side-plank', name: 'Side Plank', category: 'Core', equipment: 'None', difficulty: 'Intermediate', muscles: ['Obliques'], description: 'Stack shoulders and hips. Keep body straight.' },
  { id: 'v-ups', name: 'V-Ups', category: 'Core', equipment: 'None', difficulty: 'Intermediate', muscles: ['Abs'], description: 'Reach hands to toes.' },
  { id: 'pallof', name: 'Pallof Press', category: 'Core', equipment: 'Resistance Band', difficulty: 'Intermediate', muscles: ['Core'], description: 'Anti-rotation core stability.' },
  { id: 'dead-bug', name: 'Dead Bug', category: 'Core', equipment: 'None', difficulty: 'Beginner', muscles: ['Core'], description: 'Lower opposite arm and leg while keeping back pressed down.' },
  { id: 'bird-dog', name: 'Bird Dog', category: 'Core', equipment: 'None', difficulty: 'Beginner', muscles: ['Core', 'Back'], description: 'Extend opposite arm and leg, keep hips level.' },
  { id: 'plank', name: 'Plank', category: 'Core', equipment: 'None', difficulty: 'Beginner', muscles: ['Core'], description: 'Hold straight line from head to heels.' },
  { id: 'mountain-climber', name: 'Mountain Climbers', category: 'Core', equipment: 'None', difficulty: 'Intermediate', muscles: ['Core', 'Shoulders'], description: 'Drive knees in controlled pace.' },
  { id: 'pilates-hundred', name: 'Pilates Hundred', category: 'Core', equipment: 'None', difficulty: 'Beginner', muscles: ['Core'], description: 'Pump arms while holding legs extended.' },
  { id: 'roll-up', name: 'Pilates Roll-Up', category: 'Core', equipment: 'None', difficulty: 'Intermediate', muscles: ['Abs'], description: 'Roll up vertebra by vertebra.', hidden: true },

  // Full Body (5 visible)
  { id: 'thruster', name: 'Thruster', category: 'Full Body', equipment: 'Dumbbells', difficulty: 'Advanced', muscles: ['Full Body'], description: 'Squat into overhead press.' },
  { id: 'burpee', name: 'Burpee', category: 'Full Body', equipment: 'None', difficulty: 'Advanced', muscles: ['Full Body'], description: 'Squat, plank, jump.' },
  { id: 'kettlebell-swing', name: 'Kettlebell Swing', category: 'Full Body', equipment: 'Dumbbells', difficulty: 'Intermediate', muscles: ['Glutes', 'Core'], description: 'Hinge and swing to shoulder height.' },
  { id: 'clean-press', name: 'Dumbbell Clean & Press', category: 'Full Body', equipment: 'Dumbbells', difficulty: 'Advanced', muscles: ['Full Body'], description: 'Pull to shoulders then press overhead.', hidden: true },
  { id: 'cat-cow', name: 'Cat-Cow', category: 'Full Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Spine'], description: 'Alternate arching and rounding the back.' },
  { id: 'hip-circles', name: 'Hip Circles', category: 'Full Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Hips'], description: 'Circle hips to open the joint.', hidden: true },
  { id: 'shoulder-circles', name: 'Shoulder Circles', category: 'Full Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Shoulders'], description: 'Large controlled circles.' },
  { id: 'world-greatest', name: "World's Greatest Stretch", category: 'Full Body', equipment: 'None', difficulty: 'Beginner', muscles: ['Hips', 'Thoracic'], description: 'Lunge with rotation.', hidden: true },
];

export const visibleExercises = exercises.filter((e) => !e.hidden);

export const categories = ['Lower Body','Upper Body','Core','Full Body'] as const;

export type TrainingPlan = {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
  exerciseIds: string[];
};

export const plans: TrainingPlan[] = [
  {
    id: 'beginner',
    name: 'Beginner Strength',
    description: 'A short full-body session using beginner exercises from the library.',
    isPro: false,
    exerciseIds: ['goblet-squat', 'glute-bridge', 'push-up', 'bicycle-crunches', 'calf-raise', 'bird-dog'],
  },
  {
    id: 'full-body',
    name: 'Full Body',
    description: 'A longer mixed session drawn from lower body, upper body and core work.',
    isPro: true,
    exerciseIds: ['goblet-squat', 'rdl', 'dumbbell-press', 'shoulder-press', 'row', 'leg-raises', 'thruster', 'plank'],
  },
  {
    id: 'upper',
    name: 'Upper Body',
    description: 'Pressing, pulling and arm work from the library.',
    isPro: true,
    exerciseIds: ['dumbbell-press', 'incline-press', 'shoulder-press', 'front-raise', 'row', 'biceps-curl', 'triceps-ext', 'rear-delt'],
  },
];

export const visiblePlans: TrainingPlan[] = plans.map((plan) => ({
  ...plan,
  exerciseIds: plan.exerciseIds.filter((id) => visibleExercises.some((e) => e.id === id)),
}));

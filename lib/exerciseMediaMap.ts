import type { ImageSourcePropType } from 'react-native';

export type ExerciseMediaFrames = {
  start?: ImageSourcePropType;
  end?: ImageSourcePropType;
  hold?: ImageSourcePropType;
};

const MEDIA: Record<string, ExerciseMediaFrames> = {
  'goblet-squat': {
    start: require('../assets/exercise-media/goblet-squat-start.webp'),
    end: require('../assets/exercise-media/goblet-squat-end.webp')
  },
  'rdl': {
    start: require('../assets/exercise-media/romanian-deadlift-start.webp'),
    end: require('../assets/exercise-media/romanian-deadlift-end.webp')
  },
  'glute-bridge': {
    start: require('../assets/exercise-media/glute-bridge-start.webp'),
    end: require('../assets/exercise-media/glute-bridge-end.webp')
  },
  'hip-thrust': {
    start: require('../assets/exercise-media/hip-thrusts-start.webp'),
    end: require('../assets/exercise-media/hip-thrusts-end.webp')
  },
  'bulgarian-split-squat': {
    start: require('../assets/exercise-media/bulgarian-split-squat-start.webp'),
    end: require('../assets/exercise-media/bulgarian-split-squat-end.webp')
  },
  'lateral-lunge': {
    start: require('../assets/exercise-media/lateral-lunge-start.webp'),
    end: require('../assets/exercise-media/lateral-lunge-end.webp')
  },
  'sumo-squat': {
    start: require('../assets/exercise-media/sumo-squat-start.webp'),
    end: require('../assets/exercise-media/sumo-squat-end.webp')
  },
  'step-up': {
    start: require('../assets/exercise-media/step-ups-start.webp'),
    end: require('../assets/exercise-media/step-ups-end.webp')
  },
  'walking-lunge': {
    start: require('../assets/exercise-media/dumbbell-lunge-start.webp'),
    end: require('../assets/exercise-media/dumbbell-lunge-end.webp')
  },
  'reverse-lunge': {
    start: require('../assets/exercise-media/reverse-lunge-start.webp'),
    end: require('../assets/exercise-media/reverse-lunge-end.webp')
  },
  'curtsy-lunge': {
    start: require('../assets/exercise-media/curtsy-lunge-start.webp'),
    end: require('../assets/exercise-media/curtsy-lunge-end.webp')
  },
  'single-leg-rdl': {
    start: require('../assets/exercise-media/single-leg-romanian-deadlift-start.webp'),
    end: require('../assets/exercise-media/single-leg-romanian-deadlift-end.webp')
  },
  'calf-raise': {
    start: require('../assets/exercise-media/calf-raises-start.webp'),
    end: require('../assets/exercise-media/calf-raises-end.webp')
  },
  'frog-pump': {
    start: require('../assets/exercise-media/frog-pumps-start.webp'),
    end: require('../assets/exercise-media/frog-pumps-end.webp')
  },
  'fire-hydrant': {
    start: require('../assets/exercise-media/fire-hydrants-start.webp'),
    end: require('../assets/exercise-media/fire-hydrants-end.webp')
  },
  'donkey-kick': {
    start: require('../assets/exercise-media/donkey-kicks-start.webp'),
    end: require('../assets/exercise-media/donkey-kicks-end.webp')
  },
  'wall-sit': {
    hold: require('../assets/exercise-media/wall-sit-hold.webp')
  },
  'good-morning': {
    start: require('../assets/exercise-media/good-morning-start.webp'),
    end: require('../assets/exercise-media/good-morning-end.webp')
  },
  'push-up': {
    start: require('../assets/exercise-media/push-up-start.webp'),
    end: require('../assets/exercise-media/push-up-end.webp')
  },
  'dumbbell-press': {
    start: require('../assets/exercise-media/dumbbell-chest-press-start.webp'),
    end: require('../assets/exercise-media/dumbbell-chest-press-end.webp')
  },
  'lateral-raise': {
    start: require('../assets/exercise-media/lateral-raises-start.webp'),
    end: require('../assets/exercise-media/lateral-raises-end.webp')
  },
  'band-press': {
    start: require('../assets/exercise-media/band-chest-press-start.webp'),
    end: require('../assets/exercise-media/band-chest-press-end.webp')
  },
  'shoulder-press': {
    start: require('../assets/exercise-media/dumbbell-shoulder-press-start.webp'),
    end: require('../assets/exercise-media/dumbbell-shoulder-press-end.webp')
  },
  'front-raise': {
    start: require('../assets/exercise-media/front-raises-start.webp'),
    end: require('../assets/exercise-media/front-raises-end.webp')
  },
  'biceps-curl': {
    start: require('../assets/exercise-media/biceps-curl-start.webp'),
    end: require('../assets/exercise-media/biceps-curl-end.webp')
  },
  'triceps-ext': {
    start: require('../assets/exercise-media/band-tricep-pushdown-start.webp'),
    end: require('../assets/exercise-media/band-tricep-pushdown-end.webp')
  },
  'incline-press': {
    start: require('../assets/exercise-media/incline-dumbbell-press-start.webp'),
    end: require('../assets/exercise-media/incline-dumbbell-press-end.webp')
  },
  'rear-delt': {
    start: require('../assets/exercise-media/rear-delt-fly-start.webp'),
    end: require('../assets/exercise-media/rear-delt-fly-end.webp')
  },
  'row': {
    start: require('../assets/exercise-media/dumbbell-row-start.webp'),
    end: require('../assets/exercise-media/dumbbell-row-end.webp')
  },
  'overhead-ext': {
    start: require('../assets/exercise-media/overhead-triceps-extension-start.webp'),
    end: require('../assets/exercise-media/overhead-triceps-extension-end.webp')
  },
  'bicycle-crunches': {
    start: require('../assets/exercise-media/bicycle-crunch-start.webp'),
    end: require('../assets/exercise-media/bicycle-crunch-end.webp')
  },
  'leg-raises': {
    start: require('../assets/exercise-media/leg-raises-start.webp'),
    end: require('../assets/exercise-media/leg-raises-end.webp')
  },
  'russian-twist': {
    start: require('../assets/exercise-media/russian-twists-start.webp'),
    end: require('../assets/exercise-media/russian-twists-end.webp')
  },
  'side-plank': {
    hold: require('../assets/exercise-media/side-plank-hold.webp')
  },
  'v-ups': {
    start: require('../assets/exercise-media/v-up-start.webp'),
    end: require('../assets/exercise-media/v-up-end.webp')
  },
  'pallof': {
    start: require('../assets/exercise-media/band-pallof-press-start.webp'),
    end: require('../assets/exercise-media/band-pallof-press-end.webp')
  },
  'dead-bug': {
    start: require('../assets/exercise-media/dead-bug-start.webp'),
    end: require('../assets/exercise-media/dead-bug-end.webp')
  },
  'bird-dog': {
    start: require('../assets/exercise-media/bird-dog-start.webp'),
    end: require('../assets/exercise-media/bird-dog-end.webp')
  },
  'plank': {
    hold: require('../assets/exercise-media/plank-hold.webp')
  },
  'mountain-climber': {
    start: require('../assets/exercise-media/mountain-climbers-start.webp'),
    end: require('../assets/exercise-media/mountain-climbers-end.webp')
  },
  'thruster': {
    start: require('../assets/exercise-media/thruster-start.webp'),
    end: require('../assets/exercise-media/thruster-end.webp')
  },
  'burpee': {
    start: require('../assets/exercise-media/burpees-start.webp'),
    end: require('../assets/exercise-media/burpees-end.webp')
  },
  'kettlebell-swing': {
    start: require('../assets/exercise-media/kettlebell-swing-start.webp'),
    end: require('../assets/exercise-media/kettlebell-swing-end.webp')
  },
  'cat-cow': {
    start: require('../assets/exercise-media/cat-cow-start.webp'),
    end: require('../assets/exercise-media/cat-cow-end.webp')
  },
  'shoulder-circles': {
    start: require('../assets/exercise-media/arm-circles-start.webp'),
    end: require('../assets/exercise-media/arm-circles-end.webp')
  },
};

export function mediaFor(id: string): ExerciseMediaFrames | null {
  return MEDIA[id] || null;
}


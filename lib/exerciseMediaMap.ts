import type { ImageSourcePropType } from 'react-native';

export type ExerciseMediaFrames = {
  start?: ImageSourcePropType;
  end?: ImageSourcePropType;
  hold?: ImageSourcePropType;
};

/** AI-generated illustrations of a woman, start and end position of each move used in the programmes. */
const MEDIA: Record<string, ExerciseMediaFrames> = {
  'biceps-curl': { start: require('../assets/exercise-media-women/biceps-curl-start.webp'), end: require('../assets/exercise-media-women/biceps-curl-end.webp') },
  'bicycle-crunches': { start: require('../assets/exercise-media-women/bicycle-crunches-start.webp'), end: require('../assets/exercise-media-women/bicycle-crunches-end.webp') },
  'bird-dog': { start: require('../assets/exercise-media-women/bird-dog-start.webp'), end: require('../assets/exercise-media-women/bird-dog-end.webp') },
  'bulgarian-split-squat': { start: require('../assets/exercise-media-women/bulgarian-split-squat-start.webp'), end: require('../assets/exercise-media-women/bulgarian-split-squat-end.webp') },
  'calf-raise': { start: require('../assets/exercise-media-women/calf-raise-start.webp'), end: require('../assets/exercise-media-women/calf-raise-end.webp') },
  'cat-cow': { start: require('../assets/exercise-media-women/cat-cow-start.webp'), end: require('../assets/exercise-media-women/cat-cow-end.webp') },
  'curtsy-lunge': { start: require('../assets/exercise-media-women/curtsy-lunge-start.webp'), end: require('../assets/exercise-media-women/curtsy-lunge-end.webp') },
  'dead-bug': { start: require('../assets/exercise-media-women/dead-bug-start.webp'), end: require('../assets/exercise-media-women/dead-bug-end.webp') },
  'donkey-kick': { start: require('../assets/exercise-media-women/donkey-kick-start.webp'), end: require('../assets/exercise-media-women/donkey-kick-end.webp') },
  'dumbbell-press': { start: require('../assets/exercise-media-women/dumbbell-press-start.webp'), end: require('../assets/exercise-media-women/dumbbell-press-end.webp') },
  'fire-hydrant': { start: require('../assets/exercise-media-women/fire-hydrant-start.webp'), end: require('../assets/exercise-media-women/fire-hydrant-end.webp') },
  'frog-pump': { start: require('../assets/exercise-media-women/frog-pump-start.webp'), end: require('../assets/exercise-media-women/frog-pump-end.webp') },
  'glute-bridge': { start: require('../assets/exercise-media-women/glute-bridge-start.webp'), end: require('../assets/exercise-media-women/glute-bridge-end.webp') },
  'goblet-squat': { start: require('../assets/exercise-media-women/goblet-squat-start.webp'), end: require('../assets/exercise-media-women/goblet-squat-end.webp') },
  'good-morning': { start: require('../assets/exercise-media-women/good-morning-start.webp'), end: require('../assets/exercise-media-women/good-morning-end.webp') },
  'hip-thrust': { start: require('../assets/exercise-media-women/hip-thrust-start.webp'), end: require('../assets/exercise-media-women/hip-thrust-end.webp') },
  'kettlebell-swing': { start: require('../assets/exercise-media-women/kettlebell-swing-start.webp'), end: require('../assets/exercise-media-women/kettlebell-swing-end.webp') },
  'lateral-lunge': { start: require('../assets/exercise-media-women/lateral-lunge-start.webp'), end: require('../assets/exercise-media-women/lateral-lunge-end.webp') },
  'lateral-raise': { start: require('../assets/exercise-media-women/lateral-raise-start.webp'), end: require('../assets/exercise-media-women/lateral-raise-end.webp') },
  'leg-raises': { start: require('../assets/exercise-media-women/leg-raises-start.webp'), end: require('../assets/exercise-media-women/leg-raises-end.webp') },
  'mountain-climber': { start: require('../assets/exercise-media-women/mountain-climber-start.webp'), end: require('../assets/exercise-media-women/mountain-climber-end.webp') },
  'overhead-ext': { start: require('../assets/exercise-media-women/overhead-ext-start.webp'), end: require('../assets/exercise-media-women/overhead-ext-end.webp') },
  'pilates-hundred': { start: require('../assets/exercise-media-women/pilates-hundred-start.webp'), end: require('../assets/exercise-media-women/pilates-hundred-end.webp') },
  'plank': { start: require('../assets/exercise-media-women/plank-start.webp'), end: require('../assets/exercise-media-women/plank-end.webp') },
  'push-up': { start: require('../assets/exercise-media-women/push-up-start.webp'), end: require('../assets/exercise-media-women/push-up-end.webp') },
  'rdl': { start: require('../assets/exercise-media-women/rdl-start.webp'), end: require('../assets/exercise-media-women/rdl-end.webp') },
  'reverse-lunge': { start: require('../assets/exercise-media-women/reverse-lunge-start.webp'), end: require('../assets/exercise-media-women/reverse-lunge-end.webp') },
  'row': { start: require('../assets/exercise-media-women/row-start.webp'), end: require('../assets/exercise-media-women/row-end.webp') },
  'russian-twist': { start: require('../assets/exercise-media-women/russian-twist-start.webp'), end: require('../assets/exercise-media-women/russian-twist-end.webp') },
  'shoulder-circles': { start: require('../assets/exercise-media-women/shoulder-circles-start.webp'), end: require('../assets/exercise-media-women/shoulder-circles-end.webp') },
  'shoulder-press': { start: require('../assets/exercise-media-women/shoulder-press-start.webp'), end: require('../assets/exercise-media-women/shoulder-press-end.webp') },
  'side-plank': { start: require('../assets/exercise-media-women/side-plank-start.webp'), end: require('../assets/exercise-media-women/side-plank-end.webp') },
  'single-leg-rdl': { start: require('../assets/exercise-media-women/single-leg-rdl-start.webp'), end: require('../assets/exercise-media-women/single-leg-rdl-end.webp') },
  'step-up': { start: require('../assets/exercise-media-women/step-up-start.webp'), end: require('../assets/exercise-media-women/step-up-end.webp') },
  'sumo-squat': { start: require('../assets/exercise-media-women/sumo-squat-start.webp'), end: require('../assets/exercise-media-women/sumo-squat-end.webp') },
  'v-ups': { start: require('../assets/exercise-media-women/v-ups-start.webp'), end: require('../assets/exercise-media-women/v-ups-end.webp') },
  'walking-lunge': { start: require('../assets/exercise-media-women/walking-lunge-start.webp'), end: require('../assets/exercise-media-women/walking-lunge-end.webp') },
  'wall-sit': { start: require('../assets/exercise-media-women/wall-sit-start.webp'), end: require('../assets/exercise-media-women/wall-sit-end.webp') },
};

export function mediaFor(id: string): ExerciseMediaFrames | null {
  return MEDIA[id] || null;
}

/** True when there is a woman illustration for this move. */
export const hasMedia = (id: string) => id in MEDIA;

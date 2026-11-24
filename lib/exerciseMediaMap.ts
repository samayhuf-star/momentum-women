import type { ImageSourcePropType } from 'react-native';

export type ExerciseMediaFrames = {
  start?: ImageSourcePropType;
  end?: ImageSourcePropType;
  hold?: ImageSourcePropType;
  /** Four poses in order, played as a looping flipbook. */
  frames?: ImageSourcePropType[];
};

/** Four-pose flipbook per move (AI-generated). */
const FLIP: Record<string, ImageSourcePropType[]> = {
  'biceps-curl': [require('../assets/exercise-flip/biceps-curl-1.webp'), require('../assets/exercise-flip/biceps-curl-2.webp'), require('../assets/exercise-flip/biceps-curl-3.webp'), require('../assets/exercise-flip/biceps-curl-4.webp')],
  'bicycle-crunches': [require('../assets/exercise-flip/bicycle-crunches-1.webp'), require('../assets/exercise-flip/bicycle-crunches-2.webp'), require('../assets/exercise-flip/bicycle-crunches-3.webp'), require('../assets/exercise-flip/bicycle-crunches-4.webp')],
  'bird-dog': [require('../assets/exercise-flip/bird-dog-1.webp'), require('../assets/exercise-flip/bird-dog-2.webp'), require('../assets/exercise-flip/bird-dog-3.webp'), require('../assets/exercise-flip/bird-dog-4.webp')],
  'bulgarian-split-squat': [require('../assets/exercise-flip/bulgarian-split-squat-1.webp'), require('../assets/exercise-flip/bulgarian-split-squat-2.webp'), require('../assets/exercise-flip/bulgarian-split-squat-3.webp'), require('../assets/exercise-flip/bulgarian-split-squat-4.webp')],
  'calf-raise': [require('../assets/exercise-flip/calf-raise-1.webp'), require('../assets/exercise-flip/calf-raise-2.webp'), require('../assets/exercise-flip/calf-raise-3.webp'), require('../assets/exercise-flip/calf-raise-4.webp')],
  'cat-cow': [require('../assets/exercise-flip/cat-cow-1.webp'), require('../assets/exercise-flip/cat-cow-2.webp'), require('../assets/exercise-flip/cat-cow-3.webp'), require('../assets/exercise-flip/cat-cow-4.webp')],
  'curtsy-lunge': [require('../assets/exercise-flip/curtsy-lunge-1.webp'), require('../assets/exercise-flip/curtsy-lunge-2.webp'), require('../assets/exercise-flip/curtsy-lunge-3.webp'), require('../assets/exercise-flip/curtsy-lunge-4.webp')],
  'dead-bug': [require('../assets/exercise-flip/dead-bug-1.webp'), require('../assets/exercise-flip/dead-bug-2.webp'), require('../assets/exercise-flip/dead-bug-3.webp'), require('../assets/exercise-flip/dead-bug-4.webp')],
  'donkey-kick': [require('../assets/exercise-flip/donkey-kick-1.webp'), require('../assets/exercise-flip/donkey-kick-2.webp'), require('../assets/exercise-flip/donkey-kick-3.webp'), require('../assets/exercise-flip/donkey-kick-4.webp')],
  'dumbbell-press': [require('../assets/exercise-flip/dumbbell-press-1.webp'), require('../assets/exercise-flip/dumbbell-press-2.webp'), require('../assets/exercise-flip/dumbbell-press-3.webp'), require('../assets/exercise-flip/dumbbell-press-4.webp')],
  'fire-hydrant': [require('../assets/exercise-flip/fire-hydrant-1.webp'), require('../assets/exercise-flip/fire-hydrant-2.webp'), require('../assets/exercise-flip/fire-hydrant-3.webp'), require('../assets/exercise-flip/fire-hydrant-4.webp')],
  'frog-pump': [require('../assets/exercise-flip/frog-pump-1.webp'), require('../assets/exercise-flip/frog-pump-2.webp'), require('../assets/exercise-flip/frog-pump-3.webp'), require('../assets/exercise-flip/frog-pump-4.webp')],
  'glute-bridge': [require('../assets/exercise-flip/glute-bridge-1.webp'), require('../assets/exercise-flip/glute-bridge-2.webp'), require('../assets/exercise-flip/glute-bridge-3.webp'), require('../assets/exercise-flip/glute-bridge-4.webp')],
  'goblet-squat': [require('../assets/exercise-flip/goblet-squat-1.webp'), require('../assets/exercise-flip/goblet-squat-2.webp'), require('../assets/exercise-flip/goblet-squat-3.webp'), require('../assets/exercise-flip/goblet-squat-4.webp')],
  'good-morning': [require('../assets/exercise-flip/good-morning-1.webp'), require('../assets/exercise-flip/good-morning-2.webp'), require('../assets/exercise-flip/good-morning-3.webp'), require('../assets/exercise-flip/good-morning-4.webp')],
  'hip-thrust': [require('../assets/exercise-flip/hip-thrust-1.webp'), require('../assets/exercise-flip/hip-thrust-2.webp'), require('../assets/exercise-flip/hip-thrust-3.webp'), require('../assets/exercise-flip/hip-thrust-4.webp')],
  'kettlebell-swing': [require('../assets/exercise-flip/kettlebell-swing-1.webp'), require('../assets/exercise-flip/kettlebell-swing-2.webp'), require('../assets/exercise-flip/kettlebell-swing-3.webp'), require('../assets/exercise-flip/kettlebell-swing-4.webp')],
  'lateral-lunge': [require('../assets/exercise-flip/lateral-lunge-1.webp'), require('../assets/exercise-flip/lateral-lunge-2.webp'), require('../assets/exercise-flip/lateral-lunge-3.webp'), require('../assets/exercise-flip/lateral-lunge-4.webp')],
  'lateral-raise': [require('../assets/exercise-flip/lateral-raise-1.webp'), require('../assets/exercise-flip/lateral-raise-2.webp'), require('../assets/exercise-flip/lateral-raise-3.webp'), require('../assets/exercise-flip/lateral-raise-4.webp')],
  'leg-raises': [require('../assets/exercise-flip/leg-raises-1.webp'), require('../assets/exercise-flip/leg-raises-2.webp'), require('../assets/exercise-flip/leg-raises-3.webp'), require('../assets/exercise-flip/leg-raises-4.webp')],
  'mountain-climber': [require('../assets/exercise-flip/mountain-climber-1.webp'), require('../assets/exercise-flip/mountain-climber-2.webp'), require('../assets/exercise-flip/mountain-climber-3.webp'), require('../assets/exercise-flip/mountain-climber-4.webp')],
  'overhead-ext': [require('../assets/exercise-flip/overhead-ext-1.webp'), require('../assets/exercise-flip/overhead-ext-2.webp'), require('../assets/exercise-flip/overhead-ext-3.webp'), require('../assets/exercise-flip/overhead-ext-4.webp')],
  'pilates-hundred': [require('../assets/exercise-flip/pilates-hundred-1.webp'), require('../assets/exercise-flip/pilates-hundred-2.webp'), require('../assets/exercise-flip/pilates-hundred-3.webp'), require('../assets/exercise-flip/pilates-hundred-4.webp')],
  'plank': [require('../assets/exercise-flip/plank-1.webp'), require('../assets/exercise-flip/plank-2.webp'), require('../assets/exercise-flip/plank-3.webp'), require('../assets/exercise-flip/plank-4.webp')],
  'push-up': [require('../assets/exercise-flip/push-up-1.webp'), require('../assets/exercise-flip/push-up-2.webp'), require('../assets/exercise-flip/push-up-3.webp'), require('../assets/exercise-flip/push-up-4.webp')],
  'rdl': [require('../assets/exercise-flip/rdl-1.webp'), require('../assets/exercise-flip/rdl-2.webp'), require('../assets/exercise-flip/rdl-3.webp'), require('../assets/exercise-flip/rdl-4.webp')],
  'reverse-lunge': [require('../assets/exercise-flip/reverse-lunge-1.webp'), require('../assets/exercise-flip/reverse-lunge-2.webp'), require('../assets/exercise-flip/reverse-lunge-3.webp'), require('../assets/exercise-flip/reverse-lunge-4.webp')],
  'row': [require('../assets/exercise-flip/row-1.webp'), require('../assets/exercise-flip/row-2.webp'), require('../assets/exercise-flip/row-3.webp'), require('../assets/exercise-flip/row-4.webp')],
  'russian-twist': [require('../assets/exercise-flip/russian-twist-1.webp'), require('../assets/exercise-flip/russian-twist-2.webp'), require('../assets/exercise-flip/russian-twist-3.webp'), require('../assets/exercise-flip/russian-twist-4.webp')],
  'shoulder-circles': [require('../assets/exercise-flip/shoulder-circles-1.webp'), require('../assets/exercise-flip/shoulder-circles-2.webp'), require('../assets/exercise-flip/shoulder-circles-3.webp'), require('../assets/exercise-flip/shoulder-circles-4.webp')],
  'shoulder-press': [require('../assets/exercise-flip/shoulder-press-1.webp'), require('../assets/exercise-flip/shoulder-press-2.webp'), require('../assets/exercise-flip/shoulder-press-3.webp'), require('../assets/exercise-flip/shoulder-press-4.webp')],
  'side-plank': [require('../assets/exercise-flip/side-plank-1.webp'), require('../assets/exercise-flip/side-plank-2.webp'), require('../assets/exercise-flip/side-plank-3.webp'), require('../assets/exercise-flip/side-plank-4.webp')],
  'single-leg-rdl': [require('../assets/exercise-flip/single-leg-rdl-1.webp'), require('../assets/exercise-flip/single-leg-rdl-2.webp'), require('../assets/exercise-flip/single-leg-rdl-3.webp'), require('../assets/exercise-flip/single-leg-rdl-4.webp')],
  'step-up': [require('../assets/exercise-flip/step-up-1.webp'), require('../assets/exercise-flip/step-up-2.webp'), require('../assets/exercise-flip/step-up-3.webp'), require('../assets/exercise-flip/step-up-4.webp')],
  'sumo-squat': [require('../assets/exercise-flip/sumo-squat-1.webp'), require('../assets/exercise-flip/sumo-squat-2.webp'), require('../assets/exercise-flip/sumo-squat-3.webp'), require('../assets/exercise-flip/sumo-squat-4.webp')],
  'v-ups': [require('../assets/exercise-flip/v-ups-1.webp'), require('../assets/exercise-flip/v-ups-2.webp'), require('../assets/exercise-flip/v-ups-3.webp'), require('../assets/exercise-flip/v-ups-4.webp')],
  'walking-lunge': [require('../assets/exercise-flip/walking-lunge-1.webp'), require('../assets/exercise-flip/walking-lunge-2.webp'), require('../assets/exercise-flip/walking-lunge-3.webp'), require('../assets/exercise-flip/walking-lunge-4.webp')],
  'wall-sit': [require('../assets/exercise-flip/wall-sit-1.webp'), require('../assets/exercise-flip/wall-sit-2.webp'), require('../assets/exercise-flip/wall-sit-3.webp'), require('../assets/exercise-flip/wall-sit-4.webp')],
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
  const m = MEDIA[id];
  if (!m) return null;
  return FLIP[id] ? { ...m, frames: FLIP[id] } : m;
}

/** True when there is a woman illustration for this move. */
export const hasMedia = (id: string) => id in MEDIA;

import type { ImageSourcePropType } from 'react-native';

/** AI-generated photographs of models. They are not real coaches. */
export const photos = {
  welcome: require('../assets/coach/welcome.jpg'),
  intro: require('../assets/coach/intro.jpg'),
  duo: require('../assets/coach/duo.jpg'),
  card: require('../assets/coach/card.jpg'),
  kettle: require('../assets/coach/kettle.jpg'),
  press: require('../assets/coach/press.jpg'),
  explain: require('../assets/coach/explain.jpg'),
  catcow: require('../assets/coach/catcow.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export type PhotoKey = keyof typeof photos;

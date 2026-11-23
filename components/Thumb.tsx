import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mediaFor } from '../lib/exerciseMediaMap';
import { color } from '../lib/theme';

/** Small still of an exercise. The illustrations are drawn for a light background, so the tile stays white. */
export default function Thumb({ id, name, size = 56 }: { id: string; name: string; size?: number }) {
  const media = mediaFor(id);
  const source = media?.start || media?.hold || media?.end || null;
  return (
    <View style={{ width: size, height: size, borderRadius: 10, overflow: 'hidden', backgroundColor: source ? '#FFFFFF' : color.raised, alignItems: 'center', justifyContent: 'center' }}>
      {source ? (
        <Image source={source} accessibilityLabel={name} resizeMode="contain" style={{ width: size - 6, height: size - 6 }} />
      ) : (
        <Ionicons name="body-outline" size={size * 0.45} color={color.muted} />
      )}
    </View>
  );
}

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { color, font, hit } from '../lib/theme';

type TextProps = { children: React.ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number; testID?: string };

export function Heading({ children, style, size = 30, upper = true, ...rest }: TextProps & { size?: number; upper?: boolean }) {
  return (
    <Text accessibilityRole="header" style={[{ fontFamily: font.head, fontSize: size, lineHeight: Math.round(size * 1.06), color: color.text, textTransform: upper ? 'uppercase' : 'none' }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Body({ children, style, muted = true, size = 15, ...rest }: TextProps & { muted?: boolean; size?: number }) {
  return (
    <Text style={[{ fontFamily: font.body, fontSize: size, lineHeight: Math.round(size * 1.45), color: muted ? color.muted : color.text }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Label({ children, style, ...rest }: TextProps) {
  return <Text style={[{ fontFamily: font.semi, fontSize: 15, color: color.text }, style]} {...rest}>{children}</Text>;
}

type ButtonProps = { label: string; onPress: () => void; testID?: string; style?: StyleProp<ViewStyle>; disabled?: boolean };

export function PrimaryButton({ label, onPress, testID, style, disabled }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} testID={testID} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.primary, { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}>
      <Text style={s.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SmallButton({ label, onPress, testID, style, ghost }: ButtonProps & { ghost?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} testID={testID} onPress={onPress} style={({ pressed }) => [s.small, ghost ? s.ghost : s.smallFill, { opacity: pressed ? 0.85 : 1 }, style]}>
      <Text style={[s.smallText, { color: ghost ? color.text : color.onAccent }]}>{label}</Text>
    </Pressable>
  );
}

export function Pill({ label, onPress, testID }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} testID={testID} onPress={onPress} style={s.pill}>
      <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.text }}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ name, label, onPress, testID, tint = color.text, bg = color.card }: { name: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; testID?: string; tint?: string; bg?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} testID={testID} onPress={onPress} style={[s.icon, { backgroundColor: bg }]}>
      <Ionicons name={name} size={22} color={tint} />
    </Pressable>
  );
}

export function Photo({ source, style, label, position = 'top' }: { source: ImageSource | number; style?: StyleProp<ViewStyle>; label: string; position?: 'top' | 'center' }) {
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: color.raised }, style]}>
      <Image source={source} accessibilityLabel={label} contentFit="cover" contentPosition={position} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

export function Tick({ on, size = 24 }: { on: boolean; size?: number }) {
  return on ? (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="checkmark" size={size * 0.66} color={color.onAccent} />
    </View>
  ) : (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: color.ring }} />
  );
}

export function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Ionicons name="checkmark" size={18} color={color.accent} style={{ marginTop: 2 }} />
      <Text style={{ flex: 1, fontFamily: font.body, fontSize: 15, lineHeight: 21, color: color.text }}>{children}</Text>
    </View>
  );
}

export function Wordmark() {
  return <Text style={{ fontFamily: font.head, fontSize: 14, letterSpacing: 2, color: color.accent }}>MOMENTUM WOMEN</Text>;
}

const s = StyleSheet.create({
  primary: { minHeight: 56, borderRadius: 28, backgroundColor: color.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primaryText: { fontFamily: font.head, fontSize: 15, letterSpacing: 0.6, textTransform: 'uppercase', color: color.onAccent },
  small: { minHeight: 48, borderRadius: 24, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  smallFill: { backgroundColor: color.accent },
  ghost: { borderWidth: 1.5, borderColor: color.line },
  smallText: { fontFamily: font.head, fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' },
  pill: { minHeight: hit, borderRadius: 22, paddingHorizontal: 16, backgroundColor: color.card, alignItems: 'center', justifyContent: 'center' },
  icon: { width: hit, height: hit, borderRadius: hit / 2, alignItems: 'center', justifyContent: 'center' },
});

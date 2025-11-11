import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export const ThemedIcon: React.FC<Props> = ({ name, size = 24, color = '#2F6BFF' }) => {
  return <Ionicons accessibilityElementsHidden name={name} size={size} color={color} />;
};

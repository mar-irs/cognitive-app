import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, Text } from 'react-native';

interface ProgressRingProps {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, size = 160, strokeWidth = 12, label }) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - clamped * circumference;

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E1E6FF" strokeWidth={strokeWidth} fill="transparent" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2F6BFF"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {label ? (
        <Text style={{ position: 'absolute', top: size / 2 - 12, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: '700' }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

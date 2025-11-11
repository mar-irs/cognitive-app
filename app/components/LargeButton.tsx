import React from 'react';
import { Pressable, Text, PressableProps, ViewStyle, StyleProp } from 'react-native';
import { useSettingsStore } from '@/state/settings';
import * as Haptics from 'expo-haptics';

interface LargeButtonProps extends PressableProps {
  label: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const LargeButton: React.FC<LargeButtonProps> = ({ label, icon, style, onPress, ...rest }) => {
  const enableHaptics = useSettingsStore((state) => state.settings.haptics);

  const handlePress: PressableProps['onPress'] = (event) => {
    if (enableHaptics) {
      Haptics.selectionAsync();
    }
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 20,
          paddingHorizontal: 24,
          borderRadius: 16,
          backgroundColor: pressed ? '#2244AA' : '#2F6BFF'
        },
        style
      ]}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      onPress={handlePress}
      {...rest}
    >
      {icon ? <>{icon}</> : null}
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: '700',
          marginLeft: icon ? 12 : 0
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

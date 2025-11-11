import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Speech from 'expo-speech';
import { ThemedIcon } from './ThemedIcon';

interface VoiceHintProps {
  text?: string;
  onReplay?: () => void;
}

export const VoiceHint: React.FC<VoiceHintProps> = ({ text, onReplay }) => {
  const handleReplay = () => {
    if (text) {
      Speech.speak(text, { language: 'en-US' });
    }
    onReplay?.();
  };

  return (
    <Pressable
      onPress={handleReplay}
      accessibilityRole="button"
      accessibilityLabel="Replay audio instructions"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#E7EDFF'
      }}
    >
      <ThemedIcon name="volume-high" size={24} color="#2F6BFF" />
      <Text style={{ fontSize: 18, marginLeft: 12, color: '#1B2A52', fontWeight: '600' }}>Hear it again</Text>
    </Pressable>
  );
};

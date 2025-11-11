import React from 'react';
import { View, Text } from 'react-native';
import { VoiceHint } from './VoiceHint';

interface InstructionCardProps {
  title: string;
  description: string;
  onReplay?: () => void;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({ title, description, onReplay }) => {
  return (
    <View
      style={{
        backgroundColor: '#F5F7FF',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CBD4FF'
      }}
      accessibilityRole="summary"
    >
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>{title}</Text>
      <Text style={{ fontSize: 18, lineHeight: 28 }}>{description}</Text>
      <VoiceHint text={description} onReplay={onReplay} />
    </View>
  );
};

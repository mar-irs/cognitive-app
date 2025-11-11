import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { RawOutcome } from './types';
import { LargeButton } from '@/components/LargeButton';
import { InstructionCard } from '@/components/InstructionCard';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from '@/state/settings';
import { useProfileStore } from '@/state/profile';
import * as Speech from 'expo-speech';

interface ActivityRunnerProps {
  title: string;
  instructions: string;
  level: number;
  practice?: boolean;
  onComplete: (outcome: RawOutcome) => void;
  afterComplete?: (outcome: RawOutcome) => void;
  renderContent: (onAnswer: (correct: boolean) => void) => React.ReactNode;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({
  title,
  instructions,
  level,
  practice,
  onComplete,
  afterComplete,
  renderContent
}) => {
  const { width } = useWindowDimensions();
  const [startTime] = useState(() => Date.now());
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigation = useNavigation();
  const settings = useSettingsStore((state) => state.settings);
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    if (settings.voiceGuidance) {
      Speech.speak(instructions, { language: profile?.language === 'es' ? 'es-US' : 'en-US' });
    }
  }, [instructions, settings.voiceGuidance, profile?.language]);

  const handleAnswer = (correct: boolean) => {
    setAttempts((prev) => prev + 1);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    const duration = (Date.now() - startTime) / 1000;
    const accuracy = attempts === 0 ? 0 : correctCount / attempts;
    const outcome: RawOutcome = {
      accuracy,
      reactionTime: duration / Math.max(attempts, 1),
      errors: attempts - correctCount,
      completed: true
    };
    setCompleted(true);
    onComplete(outcome);
    afterComplete?.(outcome);
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: width > 600 ? 32 : 16, backgroundColor: '#FFFFFF' }}>
      <InstructionCard title={`${title} ${practice ? '(Practice)' : ''}`} description={instructions} />
      <View style={{ flex: 1, justifyContent: 'center', marginTop: 24 }}>{renderContent(handleAnswer)}</View>
      <LargeButton label={completed ? 'Completed' : 'Finish'} onPress={handleFinish} disabled={completed} />
    </View>
  );
};

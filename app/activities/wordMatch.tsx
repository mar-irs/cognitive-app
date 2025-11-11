import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';
import * as Speech from 'expo-speech';

const bank = [
  { word: 'Apple', emoji: '🍎', category: 'Food' },
  { word: 'Chair', emoji: '🪑', category: 'Furniture' },
  { word: 'Sun', emoji: '☀️', category: 'Nature' },
  { word: 'Book', emoji: '📘', category: 'Learning' },
  { word: 'Dog', emoji: '🐶', category: 'Animals' }
];

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1.2 - outcome.reactionTime / 4));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.65 + speedFactor * 0.35));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const wordMatch: ActivitySpec = {
  id: 'word-match',
  domain: 'language',
  title: 'Word to Picture',
  instructions: 'Listen or read the word, then tap the matching picture.',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 60,
    targetAccuracy: 0.85,
    description: `${3 + index} options`
  })),
  run: (level, settings) => <WordMatchRunner level={level} voiceEnabled={settings.voiceGuidance} />,
  evaluate
};

interface WordMatchRunnerProps {
  level: number;
  voiceEnabled: boolean;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const WordMatchRunner: React.FC<WordMatchRunnerProps> = ({ level, voiceEnabled, practice, afterComplete }) => {
  const recordOutcome = useScoresStore((state) => state.recordOutcome);
  const choices = useMemo(() => bank.slice(0, Math.min(bank.length, 3 + level)), [level]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = choices[currentIndex % choices.length];

  React.useEffect(() => {
    if (voiceEnabled) {
      Speech.speak(current.word, { language: 'en-US' });
    }
  }, [current.word, voiceEnabled]);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'word-match',
        domain: 'language',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title={wordMatch.title}
      instructions={wordMatch.instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <View style={{ alignItems: 'center', gap: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: '700' }}>{current.word}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            {choices.map((choice) => (
              <Pressable
                key={choice.word}
                onPress={() => {
                  const correct = choice.word === current.word;
                  onAnswer(correct);
                  setCurrentIndex((prev) => prev + 1);
                }}
                style={{
                  backgroundColor: '#F2F4FF',
                  borderRadius: 16,
                  paddingVertical: 20,
                  paddingHorizontal: 32,
                  minWidth: 140,
                  alignItems: 'center'
                }}
                accessibilityRole="button"
                accessibilityLabel={`Option ${choice.word}`}
              >
                <Text style={{ fontSize: 48 }}>{choice.emoji}</Text>
                <Text style={{ fontSize: 20, marginTop: 8 }}>{choice.word}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    />
  );
};

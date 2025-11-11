import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';

const pairs = [
  { symbol: '△', word: 'Triangle' },
  { symbol: '○', word: 'Circle' },
  { symbol: '□', word: 'Square' },
  { symbol: '☆', word: 'Star' },
  { symbol: '♢', word: 'Diamond' }
];

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1.5 - outcome.reactionTime / 3));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.5 + speedFactor * 0.5));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const symbolMatch: ActivitySpec = {
  id: 'symbol-match',
  domain: 'speed',
  title: 'Symbol Match',
  instructions: 'Quickly tap the word that matches the symbol shown.',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 45,
    targetAccuracy: 0.85,
    description: `Choices: ${3 + index}`
  })),
  run: (level) => <SymbolMatchRunner level={level} />,
  evaluate
};

interface SymbolMatchRunnerProps {
  level: number;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const SymbolMatchRunner: React.FC<SymbolMatchRunnerProps> = ({ level, practice, afterComplete }) => {
  const [current, setCurrent] = useState(pairs[0]);
  const recordOutcome = useScoresStore((state) => state.recordOutcome);
  const choices = pairs.slice(0, Math.min(pairs.length, 3 + level));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(choices[Math.floor(Math.random() * choices.length)]);
    }, Math.max(900, 2500 - level * 300));
    return () => clearInterval(timer);
  }, [choices, level]);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'symbol-match',
        domain: 'speed',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title={symbolMatch.title}
      instructions={symbolMatch.instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <View style={{ alignItems: 'center', gap: 24 }}>
          <Text style={{ fontSize: 72 }}>{current.symbol}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            {choices.map((choice) => (
              <Pressable
                key={choice.word}
                onPress={() => onAnswer(choice.word === current.word)}
                accessibilityRole="button"
                accessibilityLabel={`Option ${choice.word}`}
                style={{
                  backgroundColor: '#2F6BFF',
                  paddingVertical: 20,
                  paddingHorizontal: 32,
                  borderRadius: 16,
                  minWidth: 140
                }}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' }}>{choice.word}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    />
  );
};

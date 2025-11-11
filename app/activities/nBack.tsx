import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';

const shapes = ['▲', '■', '●', '◆'];

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1.1 - outcome.reactionTime / 4));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.65 + speedFactor * 0.35));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const nBack: ActivitySpec = {
  id: 'n-back',
  domain: 'memory',
  title: '2-Back Shapes',
  instructions: 'Tap when the shape matches the one shown two steps ago.',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 60,
    targetAccuracy: 0.8,
    description: `${index < 2 ? '2-back' : '3-back'} sequence`
  })),
  run: (level) => <NBackRunner level={level} />,
  evaluate
};

interface NBackRunnerProps {
  level: number;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const NBackRunner: React.FC<NBackRunnerProps> = ({ level, practice, afterComplete }) => {
  const [sequence, setSequence] = useState<string[]>(['▲', '■']);
  const [current, setCurrent] = useState('▲');
  const recordOutcome = useScoresStore((state) => state.recordOutcome);
  const depth = level >= 3 ? 3 : 2;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = shapes[Math.floor(Math.random() * shapes.length)];
        setSequence((seq) => [...seq.slice(-depth + 1), next]);
        return next;
      });
    }, Math.max(1200, 2500 - level * 250));
    return () => clearInterval(timer);
  }, [depth, level]);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'n-back',
        domain: 'memory',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title={nBack.title}
      instructions={nBack.instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <View style={{ alignItems: 'center', gap: 24 }}>
          <Text style={{ fontSize: 60 }}>{current}</Text>
          <Pressable
            onPress={() => onAnswer(sequence[0] === current)}
            accessibilityRole="button"
            accessibilityLabel="Match"
            style={{
              backgroundColor: '#2F6BFF',
              paddingVertical: 24,
              paddingHorizontal: 64,
              borderRadius: 20
            }}
          >
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Match</Text>
          </Pressable>
        </View>
      )}
    />
  );
};

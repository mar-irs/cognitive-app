import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1 - outcome.reactionTime / 3));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.6 + speedFactor * 0.4));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const goNoGo: ActivitySpec = {
  id: 'go-no-go',
  domain: 'attention',
  title: 'Go / No-Go',
  instructions: 'Press the green button when you see GO. Stay still when it shows STOP.',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 45,
    targetAccuracy: 0.85,
    description: `Stimulus every ${Math.max(1, 3 - index * 0.4)} seconds`
  })),
  run: (level) => <GoNoGoRunner level={level} />,
  evaluate
};

interface GoNoGoRunnerProps {
  level: number;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const GoNoGoRunner: React.FC<GoNoGoRunnerProps> = ({ level, practice, afterComplete }) => {
  const [stimulus, setStimulus] = useState<'go' | 'stop'>('go');
  const recordOutcome = useScoresStore((state) => state.recordOutcome);
  const interval = Math.max(1200, 3000 - level * 300);

  useEffect(() => {
    const timer = setInterval(() => {
      setStimulus(Math.random() > 0.3 ? 'go' : 'stop');
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'go-no-go',
        domain: 'attention',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title="Go / No-Go"
      instructions={goNoGo.instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <View style={{ alignItems: 'center', gap: 32 }}>
          <View
            accessibilityRole="text"
            style={{
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: stimulus === 'go' ? '#2ECC71' : '#E74C3C',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '800' }}>{stimulus === 'go' ? 'GO' : 'STOP'}</Text>
          </View>
          <Pressable
            onPress={() => onAnswer(stimulus === 'go')}
            style={{
              backgroundColor: '#2F6BFF',
              paddingVertical: 24,
              paddingHorizontal: 64,
              borderRadius: 20
            }}
            accessibilityRole="button"
            accessibilityLabel="Respond"
          >
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Respond</Text>
          </Pressable>
        </View>
      )}
    />
  );
};

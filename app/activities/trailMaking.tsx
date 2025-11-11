import React, { useMemo, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1.4 - outcome.reactionTime / 4));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.6 + speedFactor * 0.4));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const trailMaking: ActivitySpec = {
  id: 'trail-making',
  domain: 'executive',
  title: 'Trail Making',
  instructions: 'Tap the circles in order, alternating numbers and letters (1-A-2-B…).',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 90,
    targetAccuracy: 0.85,
    description: `${6 + index * 2} nodes`
  })),
  run: (level) => <TrailMakingRunner level={level} />,
  evaluate
};

interface TrailMakingRunnerProps {
  level: number;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const TrailMakingRunner: React.FC<TrailMakingRunnerProps> = ({ level, practice, afterComplete }) => {
  const recordOutcome = useScoresStore((state) => state.recordOutcome);
  const sequence = useMemo(() => {
    const length = 6 + level * 2;
    return Array.from({ length }, (_, idx) => (idx % 2 === 0 ? `${idx / 2 + 1}` : String.fromCharCode(65 + Math.floor(idx / 2))));
  }, [level]);
  const [nextIndex, setNextIndex] = useState(0);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'trail-making',
        domain: 'executive',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title={trailMaking.title}
      instructions={trailMaking.instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <ResponsiveGrid minItemWidth={120}>
          {sequence.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => {
                const correct = index === nextIndex;
                if (correct) {
                  setNextIndex((prev) => Math.min(sequence.length - 1, prev + 1));
                }
                onAnswer(correct);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Node ${item}`}
              style={{
                backgroundColor: index === nextIndex ? '#2ECC71' : '#D0D9FF',
                borderRadius: 16,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: '700' }}>{item}</Text>
            </Pressable>
          ))}
        </ResponsiveGrid>
      )}
    />
  );
};

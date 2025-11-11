import React from 'react';
import { Pressable, Text } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1.2 - outcome.reactionTime / 5));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.7 + speedFactor * 0.3));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const oddOneOut: ActivitySpec = {
  id: 'odd-one-out',
  domain: 'attention',
  title: 'Odd One Out',
  instructions: 'Tap the shape that looks different from the others as quickly as you can.',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 60,
    targetAccuracy: 0.85,
    description: `Grid with ${3 + index} columns`
  })),
  run: (level) => {
    const gridSize = 3 + level;
    const specialIndex = Math.floor(Math.random() * gridSize * gridSize);
    const renderCell = (
      index: number,
      onAnswer: (correct: boolean) => void
    ) => (
      <Pressable
        key={index}
        onPress={() => onAnswer(index === specialIndex)}
        style={{
          backgroundColor: index === specialIndex ? '#FFB347' : '#6E8BFF',
          borderRadius: 16,
          height: 120,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>{index + 1}</Text>
      </Pressable>
    );

    return (
      <ActivityRenderer
        level={level}
        instructions={oddOneOut.instructions}
        title={oddOneOut.title}
        renderCell={renderCell}
      />
    );
  },
  evaluate
};

interface ActivityRendererProps {
  level: number;
  instructions: string;
  title: string;
  renderCell: (index: number, onAnswer: (correct: boolean) => void) => React.ReactNode;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({
  level,
  instructions,
  title,
  renderCell,
  practice,
  afterComplete
}) => {
  const recordOutcome = useScoresStore((state) => state.recordOutcome);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'odd-one-out',
        domain: 'attention',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title={title}
      instructions={instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <ResponsiveGrid minItemWidth={160}>
          {Array.from({ length: (3 + level) * (3 + level) }).map((_, index) => renderCell(index, onAnswer))}
        </ResponsiveGrid>
      )}
    />
  );
};

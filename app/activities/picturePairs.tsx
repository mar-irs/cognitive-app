import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
import { ActivitySpec, NormalizedResult, RawOutcome } from './types';
import { ActivityRunner } from './ActivityRunner';
import { useScoresStore } from '@/state/scores';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

const icons = ['🍎', '🌼', '🚲', '🎵', '📚', '🧩'];

const evaluate = (outcome: RawOutcome): NormalizedResult => {
  const speedFactor = Math.max(0, Math.min(1, 1.3 - outcome.reactionTime / 5));
  const errorRate = outcome.errors / Math.max(1, outcome.errors + outcome.accuracy * 10);
  const score = Math.max(0, Math.min(1, outcome.accuracy * 0.7 + speedFactor * 0.3));
  return { score, accuracy: outcome.accuracy, speedFactor, errorRate };
};

export const picturePairs: ActivitySpec = {
  id: 'picture-pairs',
  domain: 'memory',
  title: 'Picture Pairs',
  instructions: 'Flip cards to find matching pairs. Remember where each picture is!',
  practiceEnabled: true,
  levels: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    durationSeconds: 120,
    targetAccuracy: 0.75,
    description: `${3 + index} pairs`
  })),
  run: (level) => <PicturePairsRunner level={level} />,
  evaluate
};

interface PicturePairsRunnerProps {
  level: number;
  practice?: boolean;
  afterComplete?: (outcome: RawOutcome) => void;
}

const PicturePairsRunner: React.FC<PicturePairsRunnerProps> = ({ level, practice, afterComplete }) => {
  const pairs = 3 + level;
  const dataset = icons.slice(0, pairs);
  const shuffled = [...dataset, ...dataset].sort(() => Math.random() - 0.5);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const recordOutcome = useScoresStore((state) => state.recordOutcome);

  const handleComplete = (outcome: RawOutcome) => {
    if (!practice) {
      recordOutcome({
        activityId: 'picture-pairs',
        domain: 'memory',
        level,
        result: evaluate(outcome),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <ActivityRunner
      title={picturePairs.title}
      instructions={picturePairs.instructions}
      level={level}
      practice={practice}
      onComplete={handleComplete}
      afterComplete={afterComplete}
      renderContent={(onAnswer) => (
        <ResponsiveGrid minItemWidth={140}>
          {shuffled.map((value, index) => {
            const isRevealed = revealed.includes(index) || matched.includes(index);
            return (
              <Pressable
                key={index}
                onPress={() => {
                  if (isRevealed) return;
                  const nextRevealed = [...revealed, index];
                  setRevealed(nextRevealed);
                  if (nextRevealed.length === 2) {
                    const [first, second] = nextRevealed;
                    if (shuffled[first] === shuffled[second]) {
                      setMatched((prev) => [...prev, first, second]);
                      onAnswer(true);
                    } else {
                      onAnswer(false);
                    }
                    setTimeout(() => setRevealed([]), 600);
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={isRevealed ? `Revealed ${value}` : 'Hidden card'}
                style={{
                  backgroundColor: isRevealed ? '#FFEFD5' : '#C5D4FF',
                  borderRadius: 16,
                  height: 120,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 32 }}>{isRevealed ? value : '❓'}</Text>
              </Pressable>
            );
          })}
        </ResponsiveGrid>
      )}
    />
  );
};

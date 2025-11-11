import { decideNextDifficulty, updateScores } from '@/adaptive/engine';
import { ActivityOutcome } from '@/state/scores';

const baseOutcome: ActivityOutcome = {
  activityId: 'test',
  domain: 'attention',
  level: 1,
  result: { score: 0.9, accuracy: 0.95, speedFactor: 0.8, errorRate: 0.05 },
  timestamp: new Date().toISOString()
};

describe('adaptive engine', () => {
  it('promotes difficulty when score is high', () => {
    const decision = decideNextDifficulty(1, baseOutcome.result);
    expect(decision.nextLevel).toBeGreaterThan(1);
    expect(decision.trend).toBe('up');
  });

  it('updates domain score', () => {
    const updated = updateScores(
      { attention: 100, memory: 100, language: 100, executive: 100, speed: 100 },
      baseOutcome
    );
    expect(updated.attention).toBeGreaterThan(100);
  });
});

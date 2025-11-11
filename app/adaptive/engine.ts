import { ActivityOutcome, CognitiveScores } from '@/state/scores';
import { Domain } from '@/activities/types';

const K = 12;
const targetError = 0.15;

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const updateScores = (scores: CognitiveScores, outcome: ActivityOutcome): CognitiveScores => {
  const { domain, result } = outcome;
  const expected = clamp(result.score - Math.abs(result.errorRate - targetError));
  const delta = K * (result.score - expected);

  return {
    ...scores,
    [domain]: clamp(scores[domain] + delta, 0, 200)
  } as CognitiveScores;
};

export interface DifficultyDecision {
  nextLevel: number;
  trend: 'up' | 'down' | 'steady';
}

export const decideNextDifficulty = (currentLevel: number, result: ActivityOutcome['result']): DifficultyDecision => {
  const expected = clamp(result.score - Math.abs(result.errorRate - targetError));
  const delta = result.score - expected;
  const threshold = 0.08;
  if (delta > threshold) {
    return { nextLevel: Math.min(20, currentLevel + 1), trend: 'up' };
  }
  if (delta < -threshold) {
    return { nextLevel: Math.max(1, currentLevel - 1), trend: 'down' };
  }
  return { nextLevel: currentLevel, trend: 'steady' };
};

export const aggregateWeekly = (history: ActivityOutcome[], domain: Domain): { average: number; trend: number } => {
  const domainHistory = history.filter((item) => item.domain === domain).slice(0, 14);
  if (domainHistory.length === 0) {
    return { average: 0, trend: 0 };
  }
  const avg = domainHistory.reduce((acc, item) => acc + item.result.score, 0) / domainHistory.length;
  const firstHalf = domainHistory.slice(domainHistory.length / 2);
  const secondHalf = domainHistory.slice(0, domainHistory.length / 2);
  const trend =
    firstHalf.reduce((acc, item) => acc + item.result.score, 0) / Math.max(firstHalf.length, 1) -
    secondHalf.reduce((acc, item) => acc + item.result.score, 0) / Math.max(secondHalf.length, 1);
  return { average: avg, trend };
};

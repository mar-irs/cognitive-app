import { ActivitySpec } from '@/activities/types';
import { UserProfile } from '@/state/profile';
import { CognitiveScores } from '@/state/scores';

export const buildDailyPlan = (
  profile: UserProfile | undefined,
  scores: CognitiveScores,
  catalog: ActivitySpec[]
) => {
  const sortedDomains = Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .map(([domain]) => domain);
  const plan = sortedDomains
    .slice(0, 3)
    .map((domain) => catalog.find((activity) => activity.domain === domain))
    .filter(Boolean)
    .slice(0, 3) as ActivitySpec[];

  if (plan.length < 3) {
    const filler = catalog.filter((activity) => !plan.includes(activity)).slice(0, 3 - plan.length);
    plan.push(...filler);
  }

  return plan.map((activity) => ({ activityId: activity.id, level: 1, status: 'pending' as const }));
};

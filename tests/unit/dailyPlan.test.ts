import { buildDailyPlan } from '@/adaptive/dailyPlan';
import { activities } from '@/activities/registry';

describe('daily plan', () => {
  it('prioritizes lowest domains', () => {
    const plan = buildDailyPlan(undefined, {
      attention: 80,
      memory: 120,
      language: 90,
      executive: 110,
      speed: 70
    }, activities);
    expect(plan).toHaveLength(3);
    expect(plan[0].activityId).toBeDefined();
  });
});

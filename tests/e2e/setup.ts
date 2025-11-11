import { init, cleanup } from 'detox';

describe('MindMosaic e2e', () => {
  beforeAll(async () => {
    await init();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('placeholder', async () => {
    expect(true).toBe(true);
  });
});

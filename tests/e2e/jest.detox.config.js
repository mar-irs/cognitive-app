module.exports = {
  testTimeout: 120000,
  reporters: ['detox/runners/jest/streamlineReporter'],
  setupFilesAfterEnv: ['./setup.ts']
};

export default {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/tests/globalSetup.js',
  globalTeardown: '<rootDir>/src/tests/globalTeardown.js',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupFileAfterEnv.js'],
  transform: {},
}

module.exports = {
  testEnvironment: 'node',
  roots: ['src/test'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};

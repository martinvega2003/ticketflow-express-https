module.exports = {
  preset: 'ts-jest/presets/default-esm', // Use ts-jest preset for ESM
  testEnvironment: 'node', // Use Node.js environment
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ESM
  moduleNameMapper: {
    // Let you import without .js extension in ESM
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  globals: {
    'ts-jest': {
      useESM: true // Enable ESM support in ts-jest
    }
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }] // Transform TypeScript files using ts-jest with ESM support
  },
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'] // Match test files
};

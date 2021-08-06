module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/dist/']
  // preset: 'ts-jest/presets/default-esm', // or other ESM presets
  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //   },
  // },
};
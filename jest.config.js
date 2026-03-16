module.exports = {
  verbose: true,
  rootDir: './',
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { diagnostics: false, tsconfig: './tsconfig.json' }],
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/styles/', 'src/index.ts'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}'],
  coverageDirectory: 'coverage',
};

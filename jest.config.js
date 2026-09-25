/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  // ESM-only пакеты (react-router 8) грузятся нативным require(esm) Jest:
  // swc не переводит их import.meta в CJS, поэтому allowlist в
  // transformIgnorePatterns не помогает. Флаг --experimental-vm-modules
  // для этого выставляет скрипт test в package.json.
  testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.spec.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleNameMapper: {
    // В CommonJS нет import.meta, поэтому env подменяется целиком
    '^@/config/env$': '<rootDir>/src/config/__mocks__/env.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    __APP_VERSION__: '0.0.0-test',
  },
  clearMocks: true,
};

export default config;

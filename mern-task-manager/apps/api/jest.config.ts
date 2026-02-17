import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  roots: ['<rootDir>/tests'],

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json'
      }
    ]
  }
}

export default config

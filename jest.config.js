// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFiles: ['dotenv/config'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '@controllers/(.*)$"': '<rootDir>/src/controllers/$1',
    '@entities/(.*)$': '<rootDir>/src/database/entities/$1',
    '@utils/(.*)$': '<rootDir>/src/utils/$1',
    '@schemas/(.*)': '<rootDir>/src/schemas/$1',
    '@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '@database/(.*)$': '<rootDir>/src/database/$1'
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  verbose: true
};

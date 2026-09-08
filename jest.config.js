module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "jest-expo",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
};

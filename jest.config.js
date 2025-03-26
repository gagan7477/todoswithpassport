module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  collectCoverage: true,
  verbose: true,
  testTimeout: 10000,
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};

export default {
  rootDir: "./",
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
    "**/tests/**/*.mjs",
    "**/?(*.)+(spec|test).mjs"
  ]
};
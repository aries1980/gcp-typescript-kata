module.exports = {
  transform: {
    "\\.(ts|tsx)$": "ts-jest"
  },
  testEnvironment: 'node',
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coveragePathIgnorePatterns: [
    "/dist/",
    "/node_modules/"
  ],
  coverageDirectory: "./coverage/"
};

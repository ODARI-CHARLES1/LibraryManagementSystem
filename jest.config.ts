import { Config } from "jest"

const config: Config = {
    preset: "ts-jest", // Uses ts-jest for TypeScript support
    testEnvironment: "node", // Specifies the environment for tests
    verbose: true, // Shows individual test results

     // Coverage Configuration
     collectCoverage: true, // Enables code coverage collection
     coverageDirectory: "coverage", // Output directory for coverage reports
     collectCoverageFrom: [
         '<rootDir>/src/**/*.ts' // Files to include for coverage
     ]
}

export default config
# knapsack-vitest

Split your vitest test suite across multiple parrallel CI nodes with [Knapsack Pro](https://knapsackpro.com/) using this [custom integration](https://docs.knapsackpro.com/2020/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework).

## Getting Started
1. Install the package
```
npm install knapsack-vitest
```
2. Update your CI to use a matrix build. See the [example project](.github/workflows/example.yaml) for reference.

https://github.com/BenLorantfy/knapsack-vitest/blob/da3cb7fd2981d15e0b4a77992deedf5444be45e6/.github/workflows/example.yaml#L9-L13

3. Replace `vitest` with `knapsack-vitest` in your CI config
4. Set the `KNAPSACK_PRO_TEST_SUITE_TOKEN` environment variable to your Knapsack Pro test suite token, and optionally set other environemnt variables as needed.  See the [example project](.github/workflows/example.yaml) for reference.

https://github.com/BenLorantfy/knapsack-vitest/blob/da3cb7fd2981d15e0b4a77992deedf5444be45e6/.github/workflows/example.yaml#L36-L45

> [!NOTE]
> The environment variable is called `KNAPSACK_PRO_TEST_SUITE_TOKEN`, not `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`

